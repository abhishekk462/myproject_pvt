import React from 'react';
import { TreeView } from '@progress/kendo-react-treeview';

import '@progress/kendo-theme-default/dist/all.css';


const tree = [{
    text: 'Priliminary', expanded: true, items: [
        { text: 'English' }, { text: 'Vocabulary' }, { text: 'Phase Improvement' }]
}, {
    text: 'Mains', items: [
        { text: 'Main1' }]
}];

class TreeViewComponent extends React.Component {
    render() {
        return (
            <TreeView
                data={tree}
                expandIcons={true}
                onExpandChange={this.onExpandChange}
                onItemClick={this.onItemClick}
                aria-multiselectable={true}
            />
        );
    }
    onItemClick = (event) => {
        event.item.selected = !event.item.selected;
        this.forceUpdate();
    }
    onExpandChange = (event) => {
        event.item.expanded = !event.item.expanded;
        this.forceUpdate();
    }
}

export default TreeViewComponent;