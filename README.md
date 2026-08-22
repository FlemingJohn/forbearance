# Forbearance

A public registry of proven inaction, built on the Attestcoin Protocol.

Lending protocols assume a liquidator will show up when a loan goes bad. Nobody
verifies it. Forbearance proves whether they actually do, and separates a broken
reward from a broken mechanism.

Submitted to BUIDL CTC 2026 Fall, AI track.

---

## The problem

Every lending market rests on one premise: when a position becomes liquidatable,
someone will close it. That premise is never verified. When it fails the position
rots past the point where closing it is profitable, and the protocol absorbs the
loss as bad debt. Celsius, BlockFi and Voyager all died this way. The mechanism
did not break. The people it depended on stopped showing up, and nobody could see
it happening.

## The two primitives

**Exclusivity yields a negative.** You cannot normally prove a thing did not
happen, because that requires enumerating everything. But only one liquidator can
close a position, first come, and once done it is done forever. So proving who
closed it at 14:50 also proves every other liquidator declined until 14:50. One
inclusion proof, a universal negative, no enumeration.

**Reverts are evidence.** The BlockProver precompile deliberately does not check
transaction success, which is why an Attestcoin Smart Contract must assert it.
Nobody uses the other side of that. Proven failed attempts inside an interval
separate two opposite diseases:

| Attempts inside the interval | Diagnosis | Remedy |
| ---------------------------- | --------- | ------ |
| None | Incentive failure. The reward was not worth claiming. | Raise the bounty |
| Several, all reverted | Mechanism failure. The call itself is broken. | Fix the contract |

Identical response times. Opposite remedies. Only a system that can prove failed
transactions can tell them apart.

---

## Which chains

| Concern | Chain | Funds needed |
| ------- | ----- | ------------ |
| Where contracts are deployed | Creditcoin CC3 Testnet, chain id `102031` | Free tCTC from the faucet |
| Where proofs are verified | CC3 Testnet, BlockProver precompile | Testnet gas, roughly 0.00003 CTC per proof |
| Which chain history is read | Ethereum mainnet, `chainKey 3` | None. Reading is permissionless |

Nothing is deployed to Ethereum mainnet and no mainnet key is ever held. CC3
Testnet attestors already track Ethereum mainnet blocks, so a contract on
Creditcoin testnet can prove that a real Aave or Morpho liquidation happened on
Ethereum mainnet. The `chainKey` is a function parameter, not a deployment
target.

That means the demo runs against real liquidations with real money at stake,
while staying inside the testnet requirement.

---

## Architecture

```
ETHEREUM MAINNET                CREDITCOIN CC3 TESTNET
read only, no wallet            deployed here, faucet funds

Aave / Morpho                   attestors already track
LiquidationCall        ──────►  mainnet blocks
AnswerUpdated                        │
    │                                ▼
    │                           attestation storage
    ▼                                │
Examiner agent  ──── proof ────► ForbearanceRegistry
LangGraph + GPT-4o               │
decides what to file             ▼
                            BlockProver precompile 0x…0FD2
                                 │
                                 ▼
                            verified, receipt asserted, stored
```

Four parts:

1. **Source chain contracts.** None deployed. Aave and Morpho already emit the
   events we need on Ethereum mainnet.
2. **Attestcoin Smart Contract.** `ForbearanceRegistry` on Creditcoin. Receives
   proofs, calls the precompile, asserts receipt status, decodes logs, stores
   intervals.
3. **Examiner agent.** Off chain. Decides which intervals are worth paying to
   file, then submits them.
4. **Dashboard.** Reads the registry and renders the liveness record.

---

## The Examiner agent

Knowledge is free. Evidence is expensive.

Both `verify` overloads on the precompile are `view`, and `is_height_attested` is
`view`, so checking a fact costs nothing. What costs money is `verifyAndEmit`,
which puts a fact on the record so contracts can enforce against it. Filing gas
also rises roughly tenfold as evidence ages past checkpointing, and a batch is
all or nothing, so one bad exhibit forfeits the whole bundle.

The agent therefore solves a real constrained problem: limited budget, too many
markets, a deadline that makes evidence more expensive by the hour, and a penalty
for filing something that does not hold.

Built with LangGraph and Azure OpenAI GPT-4o.

```
       scanMarkets
            │
            ▼
      buildCandidates          survey free, view calls only
            │
            ▼
      scoreCandidates          GPT-4o ranks by likelihood the interval holds
            │
            ▼
      decideFilings            expected bounty minus filing gas, under budget
            │
       ┌────┴────┐
       ▼         ▼
  fileEvidence  stop          only filings reach verifyAndEmit
       │
       ▼
   recordOutcome               win or loss feeds the next round
```

---

## Getting started

```sh
npm install
npm run dev
```

The dashboard runs at `http://localhost:5173`.

### Environment

Copy `.env.example` to `.env` and fill in:

```sh
VITE_CREDITCOIN_RPC_URL=https://rpc.cc3-testnet.creditcoin.network
VITE_ETHEREUM_RPC_URL=https://eth.llamarpc.com
VITE_PROOF_BUILDER_URL=https://prover.cc3-testnet.creditcoin.network
VITE_SOURCE_CHAIN_KEY=3

AZURE_OPENAI_API_KEY=
AZURE_OPENAI_API_INSTANCE_NAME=
AZURE_OPENAI_API_DEPLOYMENT_NAME=gpt-4o
AZURE_OPENAI_API_VERSION=2024-10-21
```

### Scripts

| Command | What it does |
| ------- | ------------ |
| `npm run dev` | Start the dashboard |
| `npm run build` | Typecheck and build for production |
| `npm run typecheck` | Typecheck only |
| `npm run chain:check` | List source chains supported by CC3 testnet |
| `npm run chain:prove` | Prove one Ethereum mainnet transaction end to end |
| `npm run agent:run` | Run one Examiner round |

---

## Project layout

```
src/
  chain/        read only access to Creditcoin precompiles and the proof builder
  agent/        LangGraph examiner, Azure OpenAI GPT-4o
  components/   reusable interface pieces, one stylesheet each
  features/     landing page and dashboard areas
  data/         seeded records, replaced by chain reads as they land
  lib/          formatters and pure helpers
  styles/       design tokens, base elements, utilities
  types/        shared types, re-exported from a single entry point
scripts/        one off checks against the live network
```

---

## On chain surfaces used

| Surface | Use |
| ------- | --- |
| `verifyAndEmit(chainKey, heights[], txs[], proofs[], sharedContinuityProof)` | Seal a whole interval in one batch |
| `verify(...)` both overloads, `view` | Survey candidates at zero cost |
| `calculateTxIndex(merkleProof)` | Replay guard key, no assembly needed |
| `is_height_attested(chainKey, height)` | Check a fact is provable before paying |
| `get_attestation_bounds(chainKey, height)` | Bracket a query, read evidence grade |
| `get_latest_attestation_height_and_hash(chainKey)` | Track the attested frontier |
| `get_supported_chains()` | Resolve the source chain key |
| Receipt status assertion | A reverted event is not an event |
| Attestation versus checkpoint flags | Down weight pruned evidence |
| Gas and age curve | Drives the agent's filing economics |

The receipt assertion is applied to interval endpoints and deliberately not to
attempt exhibits, because a reverted attempt is the evidence.

---

## What this does not claim

- This is not new cryptography. Forbearance is a semantic consequence of
  mechanism exclusivity, not a proof system.
- Proof establishes the facts. The diagnosis is a deterministic reading of those
  facts against thresholds published in advance, never a verdict.
- Forbearance requires winner takes all exclusivity. It generalises to any single
  winner mechanism and to every `require(!used[x])` guard, not to everything.
- Writability is unreleased, so this is readability only by necessity.
- Actors are recorded pseudonymously. The registry publishes structural
  measurements, not accusations against named parties.

---

## Licence

MIT
