import production from './production'
import development from './development'

let config = null

if (process.env.NODE_ENV === 'product') {
  config = production
} else {
  config = development
}

export default config

