import React, { Component } from 'react';
import MonacoEditor from 'react-monaco-editor'; // eslint-disable-line
import { Menu } from 'antd';
import PropTypes from 'prop-types';
import showdown from 'showdown';

const converter = new showdown.Converter();
converter.setFlavor('github');

const width = '100%';
const height = '600';

const tabs = {
  edit: 'edit',
  preview: 'preview',
};

export default class Editor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: tabs.edit,
      text: props.content,
    };
    this.onClickTab = this.onClickTab.bind(this);
    this.onChangeText = this.onChangeText.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      text: nextProps.content,
    });
  }

  onClickTab(e) {
    this.setState({ activeTab: e.key });
  }

  onChangeText(newValue) {
    this.setState({ text: newValue });
    this.props.onChange(newValue);
  }

  createMarkup() {
    return { __html: converter.makeHtml(this.state.text) };
  }

  render() {
    let menu = null;
    if (this.props.hasPreview) {
      menu = (
        <Menu
          mode="horizontal"
          defaultSelectedKeys={[tabs.edit]}
          onClick={this.onClickTab}
        >
          <Menu.Item key={tabs.edit}>
            Edit
          </Menu.Item>
          <Menu.Item key={tabs.preview}>
            Preview
          </Menu.Item>
        </Menu>
      );
    }

    let content = null;
    if (!this.props.hasPreview || this.state.activeTab === tabs.edit) {
      content = (
        <MonacoEditor
          width={width}
          height={height}
          language={this.props.language}
          theme="vs"
          value={this.state.text}
          options={{
            minimap: {
              enabled: false,
            },
            automaticLayout: true,
          }}
          onChange={this.onChangeText}
        />
      );
    } else {
      content = (
        <div
          style={{
            width,
            height: `${height}px`,
            overflow: 'auto',
          }}
          dangerouslySetInnerHTML={this.createMarkup()} // eslint-disable-line
        />
      );
    }
    return (
      <div>
        {menu}
        <div style={{
            outline: '1px solid #eee',
          }}
        >
          {content}
        </div>
      </div>
    );
  }
}


Editor.propTypes = {
  onChange: PropTypes.func.isRequired,
};
