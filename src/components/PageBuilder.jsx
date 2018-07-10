import React from "react"
import { Provider } from 'react-redux'
import { Values } from "redux-form-website-template"

import store from '../store/index'
import showResults from "./showResults"
import Form from './Form'


export default class PageBuilder extends React.Component {

  render() {
    const { page } = this.props;
    console.log('page', page);
    if (page) {
      const { content } = page;
      return(
        <Provider store={store}>
          <div className="page page-builder">
            <div className="page-container">
              <div className="page">
                <h2>Edit Page</h2>
                <Form onSubmit={showResults} initialValues={{id: page.id, pageTitle: content.pageTitle, sections: content.sections}} />
                <Values form="form" />
              </div>
            </div>
          </div>
        </Provider>
      )
    } else {
      return(
        <Provider store={store}>
          <div className="page page-builder">
            <div className="page-container">
              <div className="page">
                <h2>New Page</h2>
                <Form onSubmit={showResults} />
                <Values form="form" />
              </div>
            </div>
          </div>
        </Provider>
      )
    }
  }

}
