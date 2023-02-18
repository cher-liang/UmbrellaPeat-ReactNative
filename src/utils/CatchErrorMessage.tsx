function hasMessage(e: unknown): e is { message: string } {
    return Boolean(typeof e === 'object' && e && 'message' in e);
}

export default hasMessage;