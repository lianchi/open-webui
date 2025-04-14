import { RETRIEVAL_API_BASE_URL } from '$lib/constants'

export async function getRAGConfig(token: string) {
  let error = null

  const res = await fetch(`${RETRIEVAL_API_BASE_URL}/config`, {
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

interface ChunkConfigForm {
  chunk_size: number
  chunk_overlap: number
}

interface DocumentIntelligenceConfigForm {
  key: string
  endpoint: string
}

interface ContentExtractConfigForm {
  engine: string
  tika_server_url: string | null
  document_intelligence_config: DocumentIntelligenceConfigForm | null
}

interface YoutubeConfigForm {
  language: string[]
  translation?: string | null
  proxy_url: string
}

interface RAGConfigForm {
  PDF_EXTRACT_IMAGES?: boolean
  ENABLE_GOOGLE_DRIVE_INTEGRATION?: boolean
  ENABLE_ONEDRIVE_INTEGRATION?: boolean
  chunk?: ChunkConfigForm
  content_extraction?: ContentExtractConfigForm
  web_loader_ssl_verification?: boolean
  youtube?: YoutubeConfigForm
}

export async function updateRAGConfig(token: string, payload: RAGConfigForm) {
  let error = null

  const res = await fetch(`${RETRIEVAL_API_BASE_URL}/config/update`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      ...payload,
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

export async function getQuerySettings(token: string) {
  let error = null

  const res = await fetch(`${RETRIEVAL_API_BASE_URL}/query/settings`, {
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

interface QuerySettings {
  k: number | null
  r: number | null
  template: string | null
}

export async function updateQuerySettings(token: string, settings: QuerySettings) {
  let error = null

  const res = await fetch(`${RETRIEVAL_API_BASE_URL}/query/settings/update`, {
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

export async function getEmbeddingConfig(token: string) {
  let error = null

  const res = await fetch(`${RETRIEVAL_API_BASE_URL}/embedding`, {
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

interface OpenAIConfigForm {
  key: string
  url: string
}

interface EmbeddingModelUpdateForm {
  openai_config?: OpenAIConfigForm
  embedding_engine: string
  embedding_model: string
  embedding_batch_size?: number
}

export async function updateEmbeddingConfig(token: string, payload: EmbeddingModelUpdateForm) {
  let error = null

  const res = await fetch(`${RETRIEVAL_API_BASE_URL}/embedding/update`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      ...payload,
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

export async function getRerankingConfig(token: string) {
  let error = null

  const res = await fetch(`${RETRIEVAL_API_BASE_URL}/reranking`, {
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

interface RerankingModelUpdateForm {
  reranking_model: string
}

export async function updateRerankingConfig(token: string, payload: RerankingModelUpdateForm) {
  let error = null

  const res = await fetch(`${RETRIEVAL_API_BASE_URL}/reranking/update`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      ...payload,
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

export interface SearchDocument {
  status: boolean
  collection_name: string
  filenames: string[]
}

export async function processFile(token: string,	file_id: string,	collection_name: string | null = null) {
  let error = null

  const res = await fetch(`${RETRIEVAL_API_BASE_URL}/process/file`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      file_id,
      collection_name: collection_name || undefined,
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

export async function processYoutubeVideo(token: string, url: string) {
  let error = null

  const res = await fetch(`${RETRIEVAL_API_BASE_URL}/process/youtube`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      url,
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

export async function processWeb(token: string, collection_name: string, url: string) {
  let error = null

  const res = await fetch(`${RETRIEVAL_API_BASE_URL}/process/web`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      url,
      collection_name,
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

export async function processWebSearch(token: string,	query: string,	collection_name?: string): Promise<SearchDocument | null> {
  let error = null

  const res = await fetch(`${RETRIEVAL_API_BASE_URL}/process/web/search`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      query,
      collection_name: collection_name ?? '',
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

export async function queryDoc(token: string,	collection_name: string,	query: string,	k: number | null = null) {
  let error = null

  const res = await fetch(`${RETRIEVAL_API_BASE_URL}/query/doc`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      collection_name,
      query,
      k,
    }),
  })
    .then(async (res) => {
      if (!res.ok)
        throw await res.json()
      return res.json()
    })
    .catch((err) => {
      error = err.detail
      return null
    })

  if (error) {
    throw error
  }

  return res
}

export async function queryCollection(token: string,	collection_names: string,	query: string,	k: number | null = null) {
  let error = null

  const res = await fetch(`${RETRIEVAL_API_BASE_URL}/query/collection`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      collection_names,
      query,
      k,
    }),
  })
    .then(async (res) => {
      if (!res.ok)
        throw await res.json()
      return res.json()
    })
    .catch((err) => {
      error = err.detail
      return null
    })

  if (error) {
    throw error
  }

  return res
}

export async function resetUploadDir(token: string) {
  let error = null

  const res = await fetch(`${RETRIEVAL_API_BASE_URL}/reset/uploads`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      authorization: `Bearer ${token}`,
    },
  })
    .then(async (res) => {
      if (!res.ok)
        throw await res.json()
      return res.json()
    })
    .catch((err) => {
      error = err.detail
      return null
    })

  if (error) {
    throw error
  }

  return res
}

export async function resetVectorDB(token: string) {
  let error = null

  const res = await fetch(`${RETRIEVAL_API_BASE_URL}/reset/db`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      authorization: `Bearer ${token}`,
    },
  })
    .then(async (res) => {
      if (!res.ok)
        throw await res.json()
      return res.json()
    })
    .catch((err) => {
      error = err.detail
      return null
    })

  if (error) {
    throw error
  }

  return res
}
