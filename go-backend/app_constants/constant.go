package app_constants

type ContextKey string

const ContextUserKey ContextKey = "user"
const ContextSubKey ContextKey = "user_sub"

const USER_REGISTRATION_ENDPOINT string = "/api/register"
const USER_EXISTS_ENDPOINT string = "/api/userexists"
