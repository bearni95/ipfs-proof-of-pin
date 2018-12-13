# IPFS PoP (Proof Of Pin)
In IPFS one can easily add or pin a file. But demonstrating that the file is still in the node on the long run is a hard-to-find scenario. Here we propose a verification mechanism to ensure that a certain user still hosts a file.

To demonstrate the idea we will be using 2 actors, Paul and Carole. Paul owns a file and wants proof that Carole still owns it at a given point in time.

[Take a look at the example](./app.js) to see a very basic implementation of the proof.

## The starting scenario:
- Paul owns `video.mp4`
- Paul generates the hash for it, `QmTca4A43f4kEvzTouvYTegtp6KobixRqweV12NrvwwtFP`
- Carole gets the file in her IPFS node and pins it.

## The process
- Paul wants proof that after some time Carole still holds `video.mp4`
- Paul issues `seed`, composed of a random `salt` and a `time stamp`.
- Paul appends the seed to the bytes of `video.mp4` and calculates the final hash, which he keeps for himself.
- Paul now sends the `seed` to Carole.
- If Carole still has the file she will be able to calculate the hash of (`video.mp4` + `seed`). If she deleted the file she will not be able to recreate the seeded hash.
- Carole sends the final hash back to Paul. Paul now can verify if the provided seeded hash and his original seeded hash match, therefore proving that Carole has access to the bytes of the file at the given `time stamp`.

## Limitations
In the PoP schema trust can only be established on one-to-one basis. Given the nature of the proof it will only be useful to Paul for a given time frame.
