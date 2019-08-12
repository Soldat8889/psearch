import React from "react";
import PropTypes from "prop-types";

class BreadCrumb extends React.Component {
    static defaultProps = {
        name: "breadcrumb-1",
        currentStage: 1,
        params: {
            stages: {
                1: "Stage 1",
                2: "Stage 2"
            }
        }
	}

	/**
     * @param { String } this.props.name         Define its name (to avoid conflict-s)
	 * @param { Number } this.props.currentStage Define its current stage
     * @param { Object } this.props.params       Define params
     *      @param { Object } this.props.stages
     *          @param { Number } _key_: @param { String } this.props.stages[_key_] Define its stage for its title
	**/

	static propTypes = {
        currentStage: PropTypes.number.isRequired,
        params: PropTypes.shape({
            stages: PropTypes.object.isRequired
        }).isRequired
	}

    constructor(props) {
        super(props);

        // We use state instead of props, with them, we can attribute nextProps to them
        this.state = {
            currentStage: this.props.currentStage
        };

        // Binding methods
        this.handleCreateStages = this.handleCreateStages.bind(this);
        this.handleGetStage     = this.handleGetStage.bind(this);
    }

    componentDidMount() {
        // Calling methods
        this.handleCreateStages();
        this.handleGetStage();
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.currentStage != this.props.currentStage) {
            this.setState({
                currentStage: nextProps.currentStage
            }, this.handleGetStage());
        }
    }

    handleCreateStages() {
        // this.props.x to x
        const { params, name } = this.props;

        const stagesLength = Object.keys(params.stages).length;
        const breadcrumb = [];

        // For each elements of this object, adding element to view
        for(let i = 1, j = stagesLength; i <= j; i++) {
            breadcrumb.push(
                <div key={i} data-current-stage={false} data-label-stage={i} data-label-breadcrumb={name}>
                    <h1>{i} | {params.stages[i]}</h1>
                </div>
            );
        }

        return breadcrumb;
    }

    handleGetStage() {
        // this.props.x to x
        const { name } = this.props;
        const { currentStage } = this.state;

        const cSElementsName = document.querySelectorAll(`[data-label-breadcrumb="${name}"`);

        // For each elements with data-label-breadcrumb === name
        Array.prototype.forEach.call(cSElementsName, cSElementName => {
            const cSElementStage = cSElementName.getAttribute("data-label-stage");

            // Search current stage, which element?
            if(cSElementStage == currentStage) {
                cSElementName.setAttribute("data-current-stage", true);
                cSElementName.style.backgroundColor = "red";
            } else {
                cSElementName.setAttribute("data-current-stage", false);
                cSElementName.style.backgroundColor = "";
            }
        });
    }

    render() {
        const { currentStage } = this.state;

        return (
            <div 
                className="breadcrumb" 
                data-current-stage={currentStage}
            >
                {this.handleCreateStages()}
            </div>
        );
    }
}

export default BreadCrumb;