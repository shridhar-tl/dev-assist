let confirmHandle = null;

export function setConfirmHandle(ref) { confirmHandle = ref; }

export function confirm(content) {
    confirmHandle.show({ severity: 'warn', sticky: true, content });
}

export function hide() { confirmHandle.clear(); }