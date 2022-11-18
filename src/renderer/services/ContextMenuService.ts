import Observable from '@/services/Observable'
import React from 'react'

export type ContextMenuStateProps = {
    buttons: ContextMenuButtons[]
    x: number
    y: number
}

export type ContextMenuButtons = {
    label: string,
    onClick: () => void
}

class ContextMenuService extends Observable<ContextMenuStateProps> {

    private buttons: ContextMenuButtons[] = []
    private x = 0
    private y = 0

    public open = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, buttons: ContextMenuButtons[]): void => {
        this.x = event.clientX
        this.y = event.clientY
        this.buttons = buttons

        this.notify(this.getState())
    }

    public close = (): void => {
        this.buttons = []
        this.notify(this.getState())
    }

    public getState = (): ContextMenuStateProps => {
        return {
            buttons: this.buttons,
            x: this.x,
            y: this.y
        }
    }
}

export default new ContextMenuService()