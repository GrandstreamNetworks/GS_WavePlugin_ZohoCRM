export function getNotificationBody(body: LooseObject): string {
    let result = `<div style="color: #f0f0f0">`
    for (const property in body) {
        if (body.hasOwnProperty(property)) {
            if (body[property]) {
                result += `${body[property]}`
            }
        }
    }
    result += `</div>`
    return result;
}

// 这里声明了两个泛型 T 和 K
// T 代表函数第一个参数的类型，K 代表函数第二个参数的类型这个类型指向第一个参数类型中包含的key的值
export function getPropertyValue<T extends Object, K extends keyof T>(obj: T, key: K): T[K] {
    return obj[key]
}