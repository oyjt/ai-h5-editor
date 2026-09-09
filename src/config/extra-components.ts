import type { ComponentRegistry } from '@/types/component'
import { ComponentCategory, PropType } from '@/types/component'
import VideoWidget from '@/components/widgets/VideoWidget.vue'

export const extraComponentRegistry: ComponentRegistry = {
  video: {
    name: '视频',
    type: 'video',
    icon: 'i-tabler-player-play-filled',
    category: ComponentCategory.Basic,
    component: VideoWidget,
    defaultProps: {
      src: '',
      poster: '',
      controls: true,
      autoplay: false,
      muted: false,
      loop: false,
    },
    defaultStyles: {
      margin: '0 10px 8px',
    },
    propSchema: [
      { key: 'src', label: '视频地址', type: PropType.Text, defaultValue: '', placeholder: '请输入视频 URL' },
      { key: 'poster', label: '封面图', type: PropType.Image, defaultValue: '' },
      { key: 'controls', label: '显示控件', type: PropType.Switch, defaultValue: true },
      { key: 'autoplay', label: '自动播放', type: PropType.Switch, defaultValue: false },
      { key: 'muted', label: '静音播放', type: PropType.Switch, defaultValue: false },
      { key: 'loop', label: '循环播放', type: PropType.Switch, defaultValue: false },
    ],
  },
}
