
export interface TChatChannelData {
    userId: string,
    creation: string,
    channelName: string,
    description: string,
    chatParticipant: string[]
}

export type TChatType = 'channel' | 'direct'