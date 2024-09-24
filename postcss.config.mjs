import cssnano from 'cssnano'
import autoprefixer from 'autoprefixer'

export default {
  plugins:[
    autoprefixer,
    cssnano({
      preset: 'default',
    })
  ]
}
