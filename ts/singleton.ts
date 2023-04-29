// singleton.ts
const singletonInstances = new Map();

export function singletonFactory<T>(ClassConstructor: new () => T): T {
    let instance = singletonInstances.get(ClassConstructor);

    if (!instance) {
        instance = new ClassConstructor();
        singletonInstances.set(ClassConstructor, instance);
    }

    return instance as T;
}
