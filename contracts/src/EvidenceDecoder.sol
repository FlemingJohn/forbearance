// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

library EvidenceDecoder {
    uint256 private constant RECEIPT_STATUS_SUCCESS = 1;

    struct TransactionSummary {
        uint8 transactionType;
        uint256 receiptStatus;
        address emitter;
        bytes32 firstTopic;
    }

    function readTransactionType(bytes calldata encodedTransaction)
        internal
        pure
        returns (uint8)
    {
        require(encodedTransaction.length >= 32, "Encoded transaction too short");
        return uint8(uint256(bytes32(encodedTransaction[0:32])));
    }

    function readReceiptStatus(bytes calldata encodedTransaction)
        internal
        pure
        returns (uint256)
    {
        require(encodedTransaction.length >= 64, "Encoded transaction too short");
        return uint256(bytes32(encodedTransaction[32:64]));
    }

    function succeeded(bytes calldata encodedTransaction)
        internal
        pure
        returns (bool)
    {
        return readReceiptStatus(encodedTransaction) == RECEIPT_STATUS_SUCCESS;
    }

    function fingerprint(bytes calldata encodedTransaction)
        internal
        pure
        returns (bytes32)
    {
        return keccak256(encodedTransaction);
    }
}
