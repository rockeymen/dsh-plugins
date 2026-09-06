# dsh-credential-retirement-proof

Offline, deterministic evidence that a **supplied** credential rotation activated a new credential for every declared consumer, rejected the old credential, stayed inside its overlap window and reached a fresh zero-residual closure. Inputs and reports contain hashes and bounded public metadata only—never secrets.

This is deliberately not another key rotator. Existing DSH plugins such as `dsh-key-rotation` and `dsh-llm-key-rotation` perform pool switching and failover. This plugin performs no issuance, distribution, switching, revocation, probing or live-system query. It only recomputes a redacted settlement verdict from explicit receipts.

```sh
npm test
npm run check
node bin/dsh-credential-retirement-proof.mjs verify examples/settled.json
```

DSH tools: `dsh_credential_retirement_inspect` and `dsh_credential_retirement_verify`. MCP exposes equivalent proof-only inline tools. Reports explicitly retain `authenticatesReceipts: false`, `provesConsumerSetExhaustive: false`, and `provesAbsenceOfUndeclaredBindings: false`.

References: [NIST SP 800-57 Part 1 Rev. 5](https://csrc.nist.gov/pubs/sp/800/57/pt1/r5/final) and [NIST SP 800-63B revocation/termination guidance](https://pages.nist.gov/800-63-3/sp800-63b.html#sec6).

MIT licensed.
