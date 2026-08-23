// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {IBlockProver} from "./IBlockProver.sol";
import {EvidenceDecoder} from "./EvidenceDecoder.sol";

contract ForbearanceRegistry {
    using EvidenceDecoder for bytes;

    enum ExhibitRole {
        Opening,
        Attempt,
        Closing
    }

    enum Finding {
        Incentive,
        Mechanism
    }

    struct Interval {
        bytes32 marketId;
        uint64 chainKey;
        uint64 openedAtBlock;
        uint64 closedAtBlock;
        uint32 attemptCount;
        Finding finding;
        address filedBy;
        uint64 filedAtBlock;
    }

    address public constant BLOCK_PROVER =
        0x0000000000000000000000000000000000000FD2;

    address public immutable owner;

    mapping(bytes32 => bool) public processedExhibits;
    mapping(bytes32 => Interval) public intervals;
    mapping(bytes32 => bytes32[]) private intervalsByMarket;

    uint256 public intervalCount;
    uint256 public exhibitCount;

    event IntervalFiled(
        bytes32 indexed intervalId,
        bytes32 indexed marketId,
        uint64 openedAtBlock,
        uint64 closedAtBlock,
        uint32 attemptCount,
        Finding finding,
        address indexed filedBy
    );

    event ExhibitSealed(
        bytes32 indexed intervalId,
        uint64 blockHeight,
        uint64 transactionIndex,
        ExhibitRole role
    );

    error IntervalAlreadyFiled(bytes32 intervalId);
    error ExhibitAlreadyProcessed(bytes32 exhibitKey);
    error ProofRejected();
    error EndpointReverted(uint256 index);
    error RolesMismatch();
    error EndpointsMissing();
    error BlocksOutOfOrder();

    constructor() {
        owner = msg.sender;
    }

    function fileInterval(
        bytes32 marketId,
        uint64 chainKey,
        uint64[] calldata heights,
        bytes[] calldata encodedTransactions,
        IBlockProver.MerkleProof[] calldata merkleProofs,
        IBlockProver.ContinuityProof calldata sharedContinuityProof,
        ExhibitRole[] calldata roles
    ) external returns (bytes32 intervalId) {
        if (
            heights.length != encodedTransactions.length ||
            heights.length != merkleProofs.length ||
            heights.length != roles.length
        ) {
            revert RolesMismatch();
        }

        _requireOrderedBlocks(heights);
        (uint256 openingIndex, uint256 closingIndex) = _findEndpoints(roles);

        intervalId = keccak256(
            abi.encodePacked(
                marketId,
                chainKey,
                heights[openingIndex],
                heights[closingIndex]
            )
        );

        if (intervals[intervalId].filedAtBlock != 0) {
            revert IntervalAlreadyFiled(intervalId);
        }

        bool verified = IBlockProver(BLOCK_PROVER).verifyAndEmit(
            chainKey,
            heights,
            encodedTransactions,
            merkleProofs,
            sharedContinuityProof
        );

        if (!verified) {
            revert ProofRejected();
        }

        uint32 attemptCount = _sealExhibits(
            intervalId,
            chainKey,
            heights,
            encodedTransactions,
            merkleProofs,
            roles
        );

        Finding finding = attemptCount > 0
            ? Finding.Mechanism
            : Finding.Incentive;

        intervals[intervalId] = Interval({
            marketId: marketId,
            chainKey: chainKey,
            openedAtBlock: heights[openingIndex],
            closedAtBlock: heights[closingIndex],
            attemptCount: attemptCount,
            finding: finding,
            filedBy: msg.sender,
            filedAtBlock: uint64(block.number)
        });

        intervalsByMarket[marketId].push(intervalId);
        intervalCount += 1;

        emit IntervalFiled(
            intervalId,
            marketId,
            heights[openingIndex],
            heights[closingIndex],
            attemptCount,
            finding,
            msg.sender
        );
    }

    function listIntervals(bytes32 marketId)
        external
        view
        returns (bytes32[] memory)
    {
        return intervalsByMarket[marketId];
    }

    function countIntervals(bytes32 marketId) external view returns (uint256) {
        return intervalsByMarket[marketId].length;
    }

    function readInterval(bytes32 intervalId)
        external
        view
        returns (Interval memory)
    {
        return intervals[intervalId];
    }

    function _sealExhibits(
        bytes32 intervalId,
        uint64 chainKey,
        uint64[] calldata heights,
        bytes[] calldata encodedTransactions,
        IBlockProver.MerkleProof[] calldata merkleProofs,
        ExhibitRole[] calldata roles
    ) private returns (uint32 attemptCount) {
        for (uint256 index = 0; index < heights.length; index += 1) {
            bool isEndpoint = roles[index] != ExhibitRole.Attempt;

            if (isEndpoint && !encodedTransactions[index].succeeded()) {
                revert EndpointReverted(index);
            }

            if (!isEndpoint) {
                attemptCount += 1;
            }

            uint64 transactionIndex = IBlockProver(BLOCK_PROVER)
                .calculateTxIndex(merkleProofs[index]);

            bytes32 exhibitKey = keccak256(
                abi.encodePacked(chainKey, heights[index], transactionIndex)
            );

            if (processedExhibits[exhibitKey]) {
                revert ExhibitAlreadyProcessed(exhibitKey);
            }

            processedExhibits[exhibitKey] = true;
            exhibitCount += 1;

            emit ExhibitSealed(
                intervalId,
                heights[index],
                transactionIndex,
                roles[index]
            );
        }
    }

    function _findEndpoints(ExhibitRole[] calldata roles)
        private
        pure
        returns (uint256 openingIndex, uint256 closingIndex)
    {
        bool sawOpening = false;
        bool sawClosing = false;

        for (uint256 index = 0; index < roles.length; index += 1) {
            if (roles[index] == ExhibitRole.Opening) {
                openingIndex = index;
                sawOpening = true;
            }

            if (roles[index] == ExhibitRole.Closing) {
                closingIndex = index;
                sawClosing = true;
            }
        }

        if (!sawOpening || !sawClosing) {
            revert EndpointsMissing();
        }
    }

    function _requireOrderedBlocks(uint64[] calldata heights) private pure {
        for (uint256 index = 1; index < heights.length; index += 1) {
            if (heights[index] < heights[index - 1]) {
                revert BlocksOutOfOrder();
            }
        }
    }
}
