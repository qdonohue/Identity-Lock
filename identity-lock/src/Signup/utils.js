
export const SIGNUP_STEP = {
    LOGIN: 0,
    PHOTO: 1,
    CONFIRM: 2,
}

export const STAGE_STATUS = {
    COMPLETE: 'complete',
    CURRENT: 'current',
    UPCOMING: 'upcoming',
}

export const stepToStatus = (cur, id) => {
    if (id < cur) {
        return STAGE_STATUS.COMPLETE
    } else if (id == cur) {
        return STAGE_STATUS.CURRENT
    } else {
        return STAGE_STATUS.UPCOMING
    }
}