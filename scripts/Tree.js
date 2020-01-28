(function(global) {
  /**
   * @typedef {Object} NodeJSON
   * @property {string} CODEID
   * @property {string | null} CODEParentID
   * @property {string} CODEVal
   * @property {string} CODETxt
   * @property {string} CODEIcon
   */

  /**
   * @param {NodeJSON} node
   * @returns {HTMLLIElement}
   */
  function createDOMNode(node) {
    const nodeEl = document.createElement('li');
    nodeEl.addEventListener('click', function(e) {
      e.stopPropagation();
      if (e.target.classList.contains('node-expandable')) {
        nodeEl.classList.toggle('node-expanded');
      }
    });

    const textEl = document.createElement('span');
    textEl.className = 'node-text';
    textEl.style.backgroundImage = 'url(./assets/icon_' + node.CODEIcon + '.png)';
    textEl.innerText = node.CODETxt;
    textEl.addEventListener('click', function(e) {
      e.stopPropagation();
      console.log(node.CODEVal);
    });
    nodeEl.appendChild(textEl);

    const branch = document.createElement('ul');
    branch.className = 'branch';
    nodeEl.appendChild(branch);

    return nodeEl;
  }

  /**
   * @param {NodeJSON[]} json
   * @returns {HTMLUListElement}
   */
  function createDOMTree(json) {
    const rootNode = document.createElement('ul');
    rootNode.className = 'branch root';

    const treeDOM = {
      null: rootNode,
    };

    json.forEach(function(node) {
      /** @type HTMLElement | undefined */
      let parent = treeDOM[node.CODEParentID];

      /** @type DocumentFragment | undefined */
      let deferedNodes = treeDOM[node.CODEID];

      const branch = createDOMNode(node);
      if (parent) {
        if (parent.parentElement) {
          parent.parentElement.classList.add(
            'node-expandable',
            'node-expanded',
          );
        }
        parent.appendChild(branch);
        treeDOM[node.CODEID] = branch.querySelector('ul');
      } else {
        const fragment = document.createDocumentFragment();
        fragment.appendChild(branch);
        treeDOM[node.CODEParentID] = fragment;
      }

      // if in tree we have nodes that are awaiting parent
      // we need to create parent node and append them
      if (deferedNodes) {
        treeDOM[node.CODEID].appendChild(deferedNodes);
      }
    });

    return rootNode;
  }

  global.AP = global.AP || {};
  global.AP = {
    Tree: {
      render: createDOMTree,
    },
  };
})(window);
