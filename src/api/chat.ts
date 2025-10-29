import service from '@/utils/request';

export function apiChat(chatMessage: string[]) {
  return service({
    url: 'chat/completion',
    method: 'post',
    data: {
      chatMessage,
    },
  });
}
