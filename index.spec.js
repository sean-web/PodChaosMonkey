const { getRandomPodIndex, main } = require('./index')

let k8sApi

beforeEach(() => {
  k8sApi = {
    listNamespacedPod: jest.fn().mockResolvedValue({
      body: {
        items: [
          { metadata: { name: 'pod-1' } },
          { metadata: { name: 'pod-2' } }
        ]
      }
    }),
    deleteNamespacedPod: jest.fn().mockResolvedValue(true)
  }
})

describe('getRandomPodIndex()', () => {
  beforeEach(() => {
    // Defines set value for math.Random so that getRandomPodIndex() can be tested reliably
    jest.spyOn(global.Math, 'random').mockReturnValue(0.2)
  })

  afterEach(() => {
    jest.spyOn(global.Math, 'random').mockRestore()
  })

  it('returns a valid index', async () => {
    const randomIndex = getRandomPodIndex(10)
    expect(randomIndex).toBe(2)
  })
})

describe('deleteRandomPod', () => {
  it('should delete a pod when suitable pods exist', async () => {
    const deletePodCall = k8sApi.deleteNamespacedPod
    await main(k8sApi)
    expect(deletePodCall).toHaveBeenCalledTimes(1)
  })

  it('should not delete a pod when no pods exist', async () => {
    k8sApi.listNamespacedPod.mockResolvedValueOnce({
      body: {
        items: []
      }
    })
    const deletePodCall = k8sApi.deleteNamespacedPod
    await main(k8sApi)
    expect(deletePodCall).toHaveBeenCalledTimes(0)
  })

  it('should not delete a pod when no suitable pods exist', async () => {
    k8sApi.listNamespacedPod.mockResolvedValueOnce({
      body: {
        items: [
          { metadata: { name: 'pod-chaos-monkey-569b9fff9-zdbsn' } }
        ]
      }
    })
    const deletePodCall = k8sApi.deleteNamespacedPod
    await main(k8sApi)
    expect(deletePodCall).toHaveBeenCalledTimes(0)
  })

  it('should return an error when deleteRandomPod is unsuccessful', async () => {
    const consoleSpy = jest.spyOn(console, 'error')
    k8sApi.deleteNamespacedPod = jest.fn(() => {
      throw new Error('Some error message')
    })
    await main(k8sApi)
    expect(consoleSpy).toHaveBeenCalledWith(Error('Some error message'))
  })
})
