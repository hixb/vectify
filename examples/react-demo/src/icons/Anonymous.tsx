import type { IconNode } from 'vectify'
import { createIcon } from './createIcon'

export const iconNode: IconNode[] = [
  ['path', { stroke: '#FFF', strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 1.5, d: 'M10.176 17.446a3.21 3.21 0 1 1-6.42 0 3.21 3.21 0 0 1 6.42 0M20.246 17.446a3.21 3.21 0 1 1-6.42 0 3.21 3.21 0 0 1 6.42 0', clipRule: 'evenodd' }],
  ['path', { stroke: '#FFF', strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 1.5, d: 'M10.176 17.407c.864-1.03 2.518-.895 3.65 0M18.753 10.125l-.27-2.725c-.197-1.982-1.962-2.758-3.856-3.492-1.912-.741-3.157 2.353-5.251 0C8.03 2.736 5.854 5.33 5.52 7.4l-.27 2.725' }],
  ['path', { stroke: '#FFF', strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 1.5, d: 'M3 10.79c5.955-.98 11.956-.966 18 0' }]
]

const Anonymous = createIcon('Anonymous', iconNode, false)
export default Anonymous
