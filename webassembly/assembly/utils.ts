
export function asserts(condition: bool, message?: string): void {
    if (!condition) {
        throw new Error(message || 'Assertion failed');
    }
}

