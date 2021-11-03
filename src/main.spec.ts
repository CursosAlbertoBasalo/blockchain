import { createAgent, hashOf } from './main';

test('Good agents are happy', () => {
  const alice = createAgent();
  const bob = createAgent();
  alice.addAgent(bob);
  bob.addAgent(alice);
  alice.addData("Hello Bob! -Alice");
  bob.addData("Hello Alice! -Bob");
});

test('Bad agents were caught', () => {
  const alice = createAgent();
  const data = "bad things";
  const prev = hashOf("");
  expect(() => {
    alice.receiveBlock({
      data,
      prev,
      token: "",
      hash: hashOf(data + prev),
    });
  }).toThrow();

});