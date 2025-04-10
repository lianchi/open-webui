import { WEBUI_API_BASE_URL } from '$lib/constants'
import { getUserPosition } from '$lib/utils'

export async function getUserGroups(token: string) {
  let error = null

  const res = await fetch(`${WEBUI_API_BASE_URL}/users/groups`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  })
    .then(async (res) => {
      if (!res.ok)
        throw await res.json()
      return res.json()
    })
    .catch((err) => {
      console.log(err)
      error = err.detail
      return null
    })

  if (error) {
    throw error
  }

  return res
}

export async function getUserDefaultPermissions(token: string) {
  let error = null

  const res = await fetch(`${WEBUI_API_BASE_URL}/users/default/permissions`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  })
    .then(async (res) => {
      if (!res.ok)
        throw await res.json()
      return res.json()
    })
    .catch((err) => {
      console.log(err)
      error = err.detail
      return null
    })

  if (error) {
    throw error
  }

  return res
}

export async function updateUserDefaultPermissions(token: string, permissions: object) {
  let error = null

  const res = await fetch(`${WEBUI_API_BASE_URL}/users/default/permissions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      ...permissions,
    }),
  })
    .then(async (res) => {
      if (!res.ok)
        throw await res.json()
      return res.json()
    })
    .catch((err) => {
      console.log(err)
      error = err.detail
      return null
    })

  if (error) {
    throw error
  }

  return res
}

export async function updateUserRole(token: string, id: string, role: string) {
  let error = null

  const res = await fetch(`${WEBUI_API_BASE_URL}/users/update/role`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      id,
      role,
    }),
  })
    .then(async (res) => {
      if (!res.ok)
        throw await res.json()
      return res.json()
    })
    .catch((err) => {
      console.log(err)
      error = err.detail
      return null
    })

  if (error) {
    throw error
  }

  return res
}

export async function getUsers(token: string) {
  let error = null

  const res = await fetch(`${WEBUI_API_BASE_URL}/users/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  })
    .then(async (res) => {
      if (!res.ok)
        throw await res.json()
      return res.json()
    })
    .catch((err) => {
      console.log(err)
      error = err.detail
      return null
    })

  if (error) {
    throw error
  }

  return res || []
}

export async function getUserSettings(token: string) {
  let error = null
  const res = await fetch(`${WEBUI_API_BASE_URL}/users/user/settings`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  })
    .then(async (res) => {
      if (!res.ok)
        throw await res.json()
      return res.json()
    })
    .catch((err) => {
      console.log(err)
      error = err.detail
      return null
    })

  if (error) {
    throw error
  }

  return res
}

export async function updateUserSettings(token: string, settings: object) {
  let error = null

  const res = await fetch(`${WEBUI_API_BASE_URL}/users/user/settings/update`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      ...settings,
    }),
  })
    .then(async (res) => {
      if (!res.ok)
        throw await res.json()
      return res.json()
    })
    .catch((err) => {
      console.log(err)
      error = err.detail
      return null
    })

  if (error) {
    throw error
  }

  return res
}

export async function getUserById(token: string, userId: string) {
  let error = null

  const res = await fetch(`${WEBUI_API_BASE_URL}/users/${userId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  })
    .then(async (res) => {
      if (!res.ok)
        throw await res.json()
      return res.json()
    })
    .catch((err) => {
      console.log(err)
      error = err.detail
      return null
    })

  if (error) {
    throw error
  }

  return res
}

export async function getUserInfo(token: string) {
  let error = null
  const res = await fetch(`${WEBUI_API_BASE_URL}/users/user/info`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  })
    .then(async (res) => {
      if (!res.ok)
        throw await res.json()
      return res.json()
    })
    .catch((err) => {
      console.log(err)
      error = err.detail
      return null
    })

  if (error) {
    throw error
  }

  return res
}

export async function updateUserInfo(token: string, info: object) {
  let error = null

  const res = await fetch(`${WEBUI_API_BASE_URL}/users/user/info/update`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      ...info,
    }),
  })
    .then(async (res) => {
      if (!res.ok)
        throw await res.json()
      return res.json()
    })
    .catch((err) => {
      console.log(err)
      error = err.detail
      return null
    })

  if (error) {
    throw error
  }

  return res
}

export async function getAndUpdateUserLocation(token: string) {
  const location = await getUserPosition().catch((err) => {
    console.log(err)
    return null
  })

  if (location) {
    await updateUserInfo(token, { location })
    return location
  }
  else {
    console.log('Failed to get user location')
    return null
  }
}

export async function deleteUserById(token: string, userId: string) {
  let error = null

  const res = await fetch(`${WEBUI_API_BASE_URL}/users/${userId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  })
    .then(async (res) => {
      if (!res.ok)
        throw await res.json()
      return res.json()
    })
    .catch((err) => {
      console.log(err)
      error = err.detail
      return null
    })

  if (error) {
    throw error
  }

  return res
}

interface UserUpdateForm {
  profile_image_url: string
  email: string
  name: string
  password: string
}

export async function updateUserById(token: string, userId: string, user: UserUpdateForm) {
  let error = null

  const res = await fetch(`${WEBUI_API_BASE_URL}/users/${userId}/update`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      profile_image_url: user.profile_image_url,
      email: user.email,
      name: user.name,
      password: user.password !== '' ? user.password : undefined,
    }),
  })
    .then(async (res) => {
      if (!res.ok)
        throw await res.json()
      return res.json()
    })
    .catch((err) => {
      console.log(err)
      error = err.detail
      return null
    })

  if (error) {
    throw error
  }

  return res
}
