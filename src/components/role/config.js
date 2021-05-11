export default {
    urls: {
        'role.list': {
            'type': 'POST',
            'real': '/role/list',
            'mock': 'mock/role/list.json'
        },
        'role.add': {
            'type': 'POST',
            'real': '/role/add',
            'mock': 'mock/role/add.json'
        },
        'role.update': {
            'type': 'POST',
            'real': '/role/update',
            'mock': 'mock/role/update.json'
        },
        'role.delete': {
            'type': 'DELETE',
            'real': '/role/delete',
            'mock': 'mock/role/delete.json'
        }
    }
};
