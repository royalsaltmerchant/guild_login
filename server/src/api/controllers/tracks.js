const WaveFile = require('wavefile').WaveFile
const {
  addTrackAssetQuery,
  getTrackAssetsByKeywordQuery,
  getTrackAssetsByDownloadsQuery,
  getAllTrackAssetsQuery,
  getTrackAssetsByDownloadsAndKeywordQuery,
  getTrackAssetsByDoubleKeywordQuery,
  editTrackAssetQuery,
  getTrackAssetByIdQuery,
  removeTrackAssetQuery
} = require('../queries/tracks')
const {
  getUserByIdQuery,
  editUserQuery
} = require('../queries/users')

async function addTrackAsset(req, res, next) {
  try {
    const {name, author_id, uuid} = req.body
    const audio = req.files[0]

    wav = new WaveFile()
    wav.fromBuffer(audio.buffer)
    // calc length 
    const sampleRate = wav.fmt.sampleRate
    const samples = wav.getSamples(true, Int32Array)
    const length = (samples.length / sampleRate).toFixed(2)
    
    // get samples for waveform UI
    const samplesDesired = 1000
    const samplesResults = []

    const delta = Math.floor( samples.length / samplesDesired );
    for (i = 0; i < samples.length; i=i+delta) {
      samplesResults.push(samples[i]);
    }

    // create new track
    const data = {
      name,
      uuid,
      author_id,
      waveform: samplesResults,
      length
    }
    
    const trackData = await addTrackAssetQuery(data)

    // increment author upload count

    const userData = await getUserByIdQuery(author_id)

    const count = parseInt(userData.rows[0].upload_count)

    const newCount = count + 1

    await editUserQuery({user_id: author_id, upload_count: newCount})

    res.status(201).json(trackData.rows[0])

  } catch(err) {
    next(err)
  }
}

async function getTrackAssets(req, res, next) {
  try {

    const tracks = []
    
    if(req.body.filter) {
      if(req.body.filter === "popular") {
        if(req.body.query) {
          const trackData = await getTrackAssetsByDownloadsAndKeywordQuery({keyword: req.body.query, username: req.params.username})
          tracks.push(...trackData.rows)
        } else {
          const trackData = await getTrackAssetsByDownloadsQuery({username: req.params.username})
          tracks.push(...trackData.rows)
        }
      } else {
        if(req.body.query) {
          const trackData = await getTrackAssetsByDoubleKeywordQuery({keyword1: req.body.filter, keyword2: req.body.query, username: req.params.username})
          tracks.push(...trackData.rows)
        } else {
          const trackData = await getTrackAssetsByKeywordQuery({keyword: req.body.filter, username: req.params.username})
          tracks.push(...trackData.rows)
        }
      }
    }

    if(!req.body.filter && req.body.query) {
      const trackData = await getTrackAssetsByKeywordQuery({keyword: req.body.query, username: req.params.username})
      tracks.push(...trackData.rows)
    }

    if(!req.body.filter && !req.body.query) {
      const trackData = await getAllTrackAssetsQuery({username: req.params.username})
      tracks.push(...trackData.rows)
    }

    // offset function
    const arrOffset = (arr, offset) => [...arr.slice(offset), ...arr.slice(0, offset)]

    // sort alphabetically if not filtering by popular
    if(!req.body.filter || req.body.filter !== "popular") {
      tracks.sort((a, b) => a.name.localeCompare(b.name, 'en', {numeric: true}))
    }

    const results = {
      tracks: arrOffset(tracks, req.body.limit + req.body.offset),
      track_count: tracks.length,
      remaining_amount: tracks.length - (req.body.offset + req.body.limit),
      offset: req.body.offset,
      amount: req.body.limit
    }
    res.send(results)
  } catch(err) {
    next(err)
  }
}

async function editTrackAsset(req, res, next) {
  try {
    
    const metadata = async () => {
      if(req.body.add_tag) {
        const trackData = await getTrackAssetByIdQuery(req.body.track_id)
        const trackMetadata = trackData.rows[0].metadata
        trackMetadata.push(req.body.add_tag)
        return trackMetadata
      } else if(req.body.remove_tag) {
        const trackData = await getTrackAssetByIdQuery(req.body.track_id)
        return trackData.rows[0].metadata.filter(data => data !== req.body.remove_tag)
      } else return null
    }

    const data = {
      track_id: req.body.track_id
    }
    if(req.body.downloads) data.downloads = req.body.downloads
    if(await metadata()) data.metadata = await metadata()

    const editTrackData = await editTrackAssetQuery(data)

    res.send(editTrackData.rows[0])
  } catch(err) {
    next(err)
  }
}

async function removeTrackAsset(req, res, next) {
  try {
    const trackData = await getTrackAssetByIdQuery(req.body.track_id)

    // decrement author upload count

    const userData = await getUserByIdQuery(trackData.rows[0].author_id)

    const count = parseInt(userData.rows[0].upload_count)

    const newCount = count - 1
    await editUserQuery({user_id: userData.rows[0].id, upload_count: newCount})

    await removeTrackAssetQuery(req.body.track_id)

    res.send({message: `Successfully removed track: ${req.body.track_id}`})
  } catch(err) {
    next(err)
  }
}

module.exports = {
  addTrackAsset,
  getTrackAssets,
  editTrackAsset,
  removeTrackAsset
}