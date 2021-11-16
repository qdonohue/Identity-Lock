


export const formatName = (name) => {
    const nameArr = name.split(' ')

    return nameArr[0] + " " + nameArr[1].charAt(0) + '.'
}