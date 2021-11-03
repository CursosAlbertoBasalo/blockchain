import { createHash } from "crypto";

export function hashOf(str: string): string {
  return createHash("sha256").update(str).digest("hex");
}

type Block = {
  data: string;
  prev: string;
  token: string;
  hash: string;
};
type Agent = {
  addAgent(agent: Agent): void;
  receiveBlock(block: Block): void;
  addData(data: Block["data"]): void;
};
const magicPrefix = Array(5).fill("0").join("");

export const createAgent = (): Agent => {
  const chain: Block[] = [{
    data: "",
    prev: "",
    token: "",
    hash: hashOf(""),
  }];
  const agents: Agent[] = [];
  return {
    addAgent(agent) { agents.push(agent); },
    addData(data) {
      while (true) {
        const prev = chain[chain.length - 1].hash;
        const token = hashOf(Math.random().toString());
        const hash = hashOf(data + prev + token);
        if (hash.startsWith(magicPrefix)) {
          const block: Block = { data, prev, token, hash };
          chain.push(block);
          for (const agent of agents) {
            agent.receiveBlock(block);
          }
          return;
        }
      }
    },
    receiveBlock(block) {
      if (block.prev != chain[chain.length - 1].hash) {
        throw new Error(
          "Hash does not point to the previous hash in the chain",
        );
      }
      if (!block.hash.startsWith(magicPrefix)) {
        throw new Error("Hash does not start with the magic prefix");
      }
      const actualHash = hashOf(block.data + block.prev + block.token);
      if (actualHash !== block.hash) {
        throw new Error("Hash is not the hash of data|prev|token");
      }
      chain.push(block);
    },
  };
};