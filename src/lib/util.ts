export const generateRandomId = () => {
    const timestamp = Date.now().toString(36);
    const randomString = Math.random().toString(36).substring(2, 8);
    return timestamp + randomString;
}

export const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#333" offset="20%" />
      <stop stop-color="#222" offset="50%" />
      <stop stop-color="#333" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#333" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`

export const toBase64 = (str: string) =>
    typeof window === 'undefined'
        ? Buffer.from(str).toString('base64')
        : window.btoa(str)

export const getRandomColor = (num: number) => {
    const colors = [
        "bg-red-600",
        "bg-blue-600",
        "bg-cyan-600",
        "bg-black",
        "bg-emerald-600",
        "bg-fuchsia-600",
        "bg-indigo-600",
        "bg-rose-600"
    ]

    const index = num % colors.length

    return colors[index]
}

export const isDateToday = (date: Date) => {
    const today = new Date()
    if (today.getDate() !== date.getDate()) {
        return false
    }

    if (today.getMonth() !== date.getMonth()) {
        return false
    }

    if (today.getFullYear() !== date.getFullYear()) {
        return false
    }
    return true
}

export const trimString = (s: string) => {
    return s.replace(/\s{2,}/g, ' ');
}

export const isEmailValid = (email: string) => {

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email)

    // const regex =/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/
    //
    // const a = new RegExp("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$")
    // return a.test(email)
    //
    // if (email.match(a)) {
    //     return true
    // }
    // return false

}