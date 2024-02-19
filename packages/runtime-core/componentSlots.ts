export function initSlots(instance, children) {
    const slots = {}
    for (const key in children) {
        const value = children[key]

        // slot
        slots[key] = Array.isArray(value) ? value : [value]
    }
    instance.slots = slots
}