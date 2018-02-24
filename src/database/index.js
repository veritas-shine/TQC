const nodeList = []
export function queryNodeList() {
  return nodeList
}

export function registerNode(node) {
  const exist = nodeList.find(looper => looper.ip === node.ip)
  if (!exist) {
    nodeList.push(node)
  }
}

export function removeNodeByIP(ip) {
  const idx = nodeList.findIndex(looper => looper.ip === ip)
  if (idx >= 0) {
    nodeList.splice(idx, 1);
  }
}
