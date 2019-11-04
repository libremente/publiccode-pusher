function GithubClient(token) {
    const TOKEN_SERVER = 'http://localhost:3000/token'
    return { get, post }

    async function get(param, data) {
        let { url, options } = endpoints(param, data)
        // const TOKEN = localStorage.getItem('ghToken')
        
        let response = await fetch(url, options)
        let json = await response.json()

        if (response.status !== 200) {
            let { message } = response
            let er = Error(message)
            er.code = response.status
            throw er
        }
        
        return json
    }

    async function post(param, data) {
        let { url, options } = endpoints(param, data)

        let response = await fetch(url, options)
        let json = await response.json()

        // bad http response handler here

        return json
    }

    function endpoints(endpoint, params) {
        const GH_API_BASE = 'https://api.github.com/'
        switch (endpoint) {
            case 'branch':
                /**
                 * `params` argument must include:
                 *   SHA-1 of master branch
                 *   user name
                 *   repo name
                 */
                return {
                    url: `${GH_API_BASE}repos/${params.user}/${params.repo}/refs`,
                    mode: 'no-cors',
                    method: 'POST',
                    options: {
                        headers: { authorization: `token ${token}` }
                    },
                    body: {
                        ref: 'refs/heads/SchemaPusher/publiccode-yml',
                        sha: params.sha
                    }
                }
            case 'token':
                return {
                    url: TOKEN_SERVER,
                    options: {
                        mode: 'no-cors',
                        method: 'POST',
                        headers: {
                            'content-type': 'application/x-www-form-urlencoded'
                        },
                        body: `code=${params.code}&state=${params.stateToken}`
                    }
                }
            case 'user':
                return {
                    url: '${GH_API_BASE}user',
                    options: {
                        headers: { Authorization: `token ${token}` }
                    }
                }
            case 'repos':
                return {
                    url: `${GH_API_BASE}users/${params.login}/repos`,
                    options: {
                        headers: { Authorization: `token ${token}` }
                    }
                }
            default:
                return null
        }
    }
}

GithubClient.generateState = function() {
    let stateToken = btoa(Date.now() * Math.random()) + btoa(Date.now() - Math.random())
    stateToken = stateToken.replace(/[\W_]/g, '')
    return stateToken
}

export default GithubClient