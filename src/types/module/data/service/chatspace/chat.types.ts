
export interface TChatChannelData {
    userId: string,
    creation?: string,
    chatName: string,
    description: string,
    chatParticipant: string[]
}

export type TChatType = 'channel' | 'direct'

export interface TChatLogDataParam { 
    sender: string,
    chatName: string, 
    message: string, 
    time?: string
    threadList?: TChatLogData[],
    chatId?: string
}

export type TChatLogData = Required<Omit<TChatLogDataParam, 'chatName'>>
