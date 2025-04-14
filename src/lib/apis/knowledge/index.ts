import { WEBUI_API_BASE_URL } from '$lib/constants'

export async function createNewKnowledge(token: string,	name: string,	description: string,	accessControl: null | object) {
  let error = null

  const res = await fetch(`${WEBUI_API_BASE_URL}/knowledge/create`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      name,
      description,
      access_control: accessControl,
    }),
  })
    .then(async (res) => {
      if (!res.ok)
        throw await res.json()
      return res.json()
    })
    .catch((err) => {
      error = err.detail
      console.log(err)
      return null
    })

  if (error) {
    throw error
  }

  return res
}

export async function getKnowledgeBases(token: string = '') {
  let error = null

  const res = await fetch(`${WEBUI_API_BASE_URL}/knowledge/`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'authorization': `Bearer ${token}`,
    },
  })
    .then(async (res) => {
      if (!res.ok)
        throw await res.json()
      return res.json()
    })
    .then((json) => {
      return json
    })
    .catch((err) => {
      error = err.detail
      console.log(err)
      return null
    })

  if (error) {
    throw error
  }

  return res
}

export async function getKnowledgeBaseList(token: string = '') {
  let error = null

  const res = await fetch(`${WEBUI_API_BASE_URL}/knowledge/list`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'authorization': `Bearer ${token}`,
    },
  })
    .then(async (res) => {
      if (!res.ok)
        throw await res.json()
      return res.json()
    })
    .then((json) => {
      return json
    })
    .catch((err) => {
      error = err.detail
      console.log(err)
      return null
    })

  if (error) {
    throw error
  }

  return res
}

export async function getKnowledgeById(token: string, id: string) {
  let error = null

  const res = await fetch(`${WEBUI_API_BASE_URL}/knowledge/${id}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'authorization': `Bearer ${token}`,
    },
  })
    .then(async (res) => {
      if (!res.ok)
        throw await res.json()
      return res.json()
    })
    .then((json) => {
      return json
    })
    .catch((err) => {
      error = err.detail

      console.log(err)
      return null
    })

  if (error) {
    throw error
  }

  return res
}

interface KnowledgeUpdateForm {
  name?: string
  description?: string
  data?: object
  access_control?: null | object
}

export async function updateKnowledgeById(token: string, id: string, form: KnowledgeUpdateForm) {
  let error = null

  const res = await fetch(`${WEBUI_API_BASE_URL}/knowledge/${id}/update`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: form?.name ? form.name : undefined,
      description: form?.description ? form.description : undefined,
      data: form?.data ? form.data : undefined,
      access_control: form.access_control,
    }),
  })
    .then(async (res) => {
      if (!res.ok)
        throw await res.json()
      return res.json()
    })
    .then((json) => {
      return json
    })
    .catch((err) => {
      error = err.detail

      console.log(err)
      return null
    })

  if (error) {
    throw error
  }

  return res
}

export async function addFileToKnowledgeById(token: string, id: string, fileId: string) {
  let error = null

  const res = await fetch(`${WEBUI_API_BASE_URL}/knowledge/${id}/file/add`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      file_id: fileId,
    }),
  })
    .then(async (res) => {
      if (!res.ok)
        throw await res.json()
      return res.json()
    })
    .then((json) => {
      return json
    })
    .catch((err) => {
      error = err.detail

      console.log(err)
      return null
    })

  if (error) {
    throw error
  }

  return res
}

export async function updateFileFromKnowledgeById(token: string, id: string, fileId: string) {
  let error = null

  const res = await fetch(`${WEBUI_API_BASE_URL}/knowledge/${id}/file/update`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      file_id: fileId,
    }),
  })
    .then(async (res) => {
      if (!res.ok)
        throw await res.json()
      return res.json()
    })
    .then((json) => {
      return json
    })
    .catch((err) => {
      error = err.detail

      console.log(err)
      return null
    })

  if (error) {
    throw error
  }

  return res
}

export async function removeFileFromKnowledgeById(token: string, id: string, fileId: string) {
  let error = null

  const res = await fetch(`${WEBUI_API_BASE_URL}/knowledge/${id}/file/remove`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      file_id: fileId,
    }),
  })
    .then(async (res) => {
      if (!res.ok)
        throw await res.json()
      return res.json()
    })
    .then((json) => {
      return json
    })
    .catch((err) => {
      error = err.detail

      console.log(err)
      return null
    })

  if (error) {
    throw error
  }

  return res
}

export async function resetKnowledgeById(token: string, id: string) {
  let error = null

  const res = await fetch(`${WEBUI_API_BASE_URL}/knowledge/${id}/reset`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'authorization': `Bearer ${token}`,
    },
  })
    .then(async (res) => {
      if (!res.ok)
        throw await res.json()
      return res.json()
    })
    .then((json) => {
      return json
    })
    .catch((err) => {
      error = err.detail

      console.log(err)
      return null
    })

  if (error) {
    throw error
  }

  return res
}

export async function deleteKnowledgeById(token: string, id: string) {
  let error = null

  const res = await fetch(`${WEBUI_API_BASE_URL}/knowledge/${id}/delete`, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'authorization': `Bearer ${token}`,
    },
  })
    .then(async (res) => {
      if (!res.ok)
        throw await res.json()
      return res.json()
    })
    .then((json) => {
      return json
    })
    .catch((err) => {
      error = err.detail

      console.log(err)
      return null
    })

  if (error) {
    throw error
  }

  return res
}

export async function reindexKnowledgeFiles(token: string) {
  let error = null

  const res = await fetch(`${WEBUI_API_BASE_URL}/knowledge/reindex`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'authorization': `Bearer ${token}`,
    },
  })
    .then(async (res) => {
      if (!res.ok)
        throw await res.json()
      return res.json()
    })
    .catch((err) => {
      error = err.detail
      console.log(err)
      return null
    })

  if (error) {
    throw error
  }

  return res
}
