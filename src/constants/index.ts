const { origin, host } = window.location

export const isDevelopment = !!(
  origin === 'http://localhost:3000' ||
  origin === 'http://localhost:3001' ||
  origin === 'https://sphinx-jarvis-david.sphinx1.repl.co'
)

export const API_URL = process.env.REACT_APP_API_URL || apiUrlFromSwarmHost() || 'https://knowledge-graph.sphinx.chat'

export const isChileGraph = API_URL.includes('boltwall')

function apiUrlFromSwarmHost(): string | undefined {
  // for swarm deployments, always point to "boltwall"
  // for now, only if the URL contains "swarm"
  if (host.includes('swarm')) {
    if (host.startsWith('nav')) {
      const hostArray = host.split('.')

      hostArray[0] = 'boltwall'

      const finalHost = hostArray.join('.')
      const apiUrl = `https://${finalHost}`

      /* eslint-disable no-console */
      console.log('API URL:', apiUrl)
      /* eslint-enable no-console */

      return apiUrl
    }
  }

  return undefined
}

export const AWS_IMAGE_BUCKET_URL = 'https://stakwork-uploads.s3.amazonaws.com/'
export const CLOUDFRONT_IMAGE_BUCKET_URL = 'https://d1gd7b7slyku8k.cloudfront.net/'

export const GRAPH_LINK_COLOR = '#ccc'
export const GRAPH_FOG_COLOR = 'blue'

export const GRAPH_GROUND_COLOR = 0xcccccc
export const GRAPH_LIGHT_INTENSITY = 1

export const BOOST_SUCCESS = 'Boosted successfully'
export const BOOST_ERROR_BUDGET = 'Boost failed, insufficient budget'

export const NODE_ADD_SUCCESS = 'Submitted!'
export const NODE_ADD_ERROR = 'Submission failed, please try again.'

export const LINK = 'link'
export const TWITTER_HANDLE = 'twitter_handle'
export const GITHUB_REPOSITORY = 'github_repository'
export const YOUTUBE_CHANNEL = 'youtube_channel'
export const TWITTER_SOURCE = 'tweet'
export const TOPIC = 'topic'

export const isE2E = !!process.env.REACT_APP_IS_E2E
