const fs = require('fs')
const IPFS = require('ipfs')
const ipfs = new IPFS()
const randomBytes = require('random-bytes')
// Used to hash the seed
const keccak256 = require('js-sha3').keccak256

let Paul = {}
let Carole = {}

// The node is running, let's start!
ipfs.on('ready', async () => {
  // We will use video.mp4 as a test file
  // After loading it into memory it gets added to IPFS

  let content = fs.readFileSync('./files/video.mp4')
  let u1 = await ipfs.files.add(content)
  // Paul now has the file's hash.
  // The original one also gets assigned to Carole
  Paul['originalHash'] = u1[0].hash
  Carole['originalHash'] = u1[0].hash

  console.log('Original hash:', Paul.originalHash)

  // Next Paul generates the salt and timestamp
  // He then concatenates both and generates the keccak256
  Paul['salt'] = randomBytes.sync(32).toString('hex')
  Paul['timestamp'] = Date.now().toString(16)
  Paul['seed'] = keccak256(Paul['salt'] + Paul['timestamp'])

  // Now Paul generates the seeded hash for the file
  Paul['seedContent'] = content.toString('hex') + Paul['seed']
  let u2 = await ipfs.files.add(Buffer.from(Paul['seedContent'], 'hex'))
  Paul['seedHash'] = u2[0].hash
  console.log('Paul\'s seeded hash:', Paul['seedHash'])

  // Now Paul shares his seed with Carole
  Carole['seed'] = Paul['seed']

  // Carole can then grab the original file, append the seed
  // and generate the final hash on her machine
  Carole['seedContent'] = content.toString('hex') + Carole['seed']
  let u3 = await ipfs.files.add(Buffer.from(Carole['seedContent'], 'hex'))
  Carole['seedHash'] = u3[0].hash
  console.log('Carole\s seeded hash:', Carole['seedHash'])
  // Carole would now send her seedHash back to Paul for verification
  console.log('Is the seeded hash provided by Carole the one Paul expected?')
  console.log(Paul['seedHash'] === Carole['seedHash'])
  process.exit()
  
})
