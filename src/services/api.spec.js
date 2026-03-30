import { describe, it, expect, afterEach, vi } from 'vitest'
import api from './api.js'

describe('ApiService', () => {
  describe('getCookie', () => {
    afterEach(() => {
      vi.unstubAllGlobals()
    })

    it('retourne la valeur d’un cookie présent', () => {
      vi.stubGlobal('document', {
        cookie: 'foo=bar; other=1',
      })
      expect(api.getCookie('foo')).toBe('bar')
    })

    it('retourne undefined si le cookie est absent', () => {
      vi.stubGlobal('document', {
        cookie: 'other=1',
      })
      expect(api.getCookie('missing')).toBeUndefined()
    })
  })
})
