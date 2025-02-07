import { fn } from '@storybook/test';
import HeaderButton from './HeaderButton';
import { Subtitle } from '@storybook/blocks';

export default {
  title: 'Example/HeaderButton',
  component: HeaderButton,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
  args: {
    // onCreateAccount: fn(),
    title: '',
    subtitle: '',
    additionalText: '',
    buttons: [],
    popupItems: [],
    openModal: fn(),
    togglePopup: fn(),
  },
};

export const ClusterHeaderButton = {
  args: {
    title: "클러스터",
    subtitle: '??????????',
    additionalText: '목록이름',
    buttons: [
      { id: 'edit_btn', label: '편집', onClick: () => console.log('Edit button clicked') },
      { id: 'delete_btn', label: '삭제', onClick: () => console.log('Delete button clicked') },
    ],
    popupItems: [

    ]
  },
};

export const LoggedOut = {};