import { ResultsBy, Statement } from 'delib-npm';
import { useState, FC } from 'react';
import Text from '../../../../components/text/Text';
import styles from './Document.module.scss';
import { updateResults } from '../../../../../functions/db/results/setResults';

import { maxKeyInObject } from '../../../../../functions/general/helpers';
import { getResultsDB } from '../../../../../functions/db/results/getResults';
import Slider from '@mui/material/Slider';





interface Props {
    statement: Statement,
    subStatements: Statement[]
}

const Document: FC<Props> = ({ statement, subStatements }) => {
    const [resultsBy, setResultsBy] = useState<ResultsBy>(statement.results?.resultsBy || ResultsBy.topOptions)
    const [results, setResults] = useState<Statement[]>([]);
    const description = statement.statement.split('\n').slice(1).join('\n');

    async function handleGetResults(ev: any) {
        try {
            console.dir(ev.target)
            //get form data with formData
            ev.preventDefault();

            const data = new FormData(ev.target);
            const resultsBy = data.get('results') as ResultsBy;
            // const numberOfResults = Number(data.get('numberOfResults'));
            // const deep = Number(data.get('deep'));
            console.log(resultsBy)

            setResultsBy(resultsBy)

            updateResults(statement.statementId, resultsBy);

            const top = await getResults(statement, subStatements, resultsBy);
            // setResults(top);
            console.log(top)
        } catch (error) {
            console.error(error);
        }

    }




    return (
        <div className='page__main'>
            <div className="wrapper">
                <section className={styles.document}>
                    <h2><Text text={statement.statement} onlyTitle={true} /></h2>
                    <Text text={description} />

                </section>
                <section className={styles.resultsWrapper}>
                    <h2>תוצאות</h2>
                    <form onSubmit={handleGetResults}>
                        <div className="btns">
                            <button type="submit">הצגת תוצאות</button>
                        </div>
                        <select name="results" id="results" defaultValue={resultsBy}>
                            <option value={ResultsBy.topOptions}>אופציות מקסימליות</option>
                            <option value={ResultsBy.topVote}>הצבעות</option>
                        </select>
                        <label htmlFor="">כמות פתרונות בכל רמה</label>
                        <Slider defaultValue={statement.results?.numberOfResults || 1} min={1} max={10} aria-label="Default" valueLabelDisplay="on" name="numberOfResults" />
                        <label htmlFor="">עומק</label>
                        <Slider defaultValue={statement.results?.deep || 1} min={1} max={4} aria-label="Default" valueLabelDisplay="on" name="deep" />
                    </form>
                    <div className={styles.results}>
                        {results.length > 0 ? results.map(result => <Text key={result.statementId} text={result.statement} />) : <h2>לא נבחרו עדיין אפשרויות</h2>}
                    </div>
                </section>
            </div>
        </div>
    )
}

export default Document;


export type Results = {
    top: Statement;
    sub?: Results[];
};

async function getResults(statement: Statement, subStatements: Statement[], resultsBy: ResultsBy): Promise<Results> {
    try {

        // const { results } = statement;

        console.log('resultsBy', resultsBy)

        const result: Results = { top: statement };




        switch (resultsBy) {
            case ResultsBy.topOne:
            case ResultsBy.topVote:
                result.sub = [...getResultsByVotes(statement, subStatements)];
                break;
            case ResultsBy.topOptions:
                result.sub = [...getResultsByOptions(statement, subStatements)];
                break
            default:
                result.sub = [];
        }

        console.log(result)

        const { results } = statement;
        if (!results) return result;
        let { deep = 0 } = results;
        if (deep === 0) return result;


        if (deep >= 2) {

            console.log('result', result)

            const subResultsPromises = result.sub.map(async (subResult: Results) => {
                const subStatement = subResult.top;
                const subResults: Statement[] = await getResultsDB(subStatement);
                console.log(`subResults ${subResult.top.statement}:`, subResults)
                return subResults;
            })

            const resultsStatements = await Promise.all(subResultsPromises);
            console.log('y', resultsStatements)
           
            result.sub.forEach((_: Results, index: number) => {
                if (!result.sub) return;
                result.sub[index].sub = [...resultsStatements[index].map((subStatement: Statement) => ({ top: subStatement }))]

                
            });

            console.log("result 2:", result)




        }


        //get results from DB


        return result;
    } catch (error) {
        console.error(error);
        return { top: statement }
    }
}






function getResultsByVotes(statement: Statement, subStatements: Statement[]): Results[] {
    try {



        const maxVoteKey = getTopVoteStatementId(statement);
        if (!maxVoteKey) return [];
        const maxVoteStatement: Statement | undefined = subStatements.find(subStatement => subStatement.statementId === maxVoteKey);
        if (!maxVoteStatement) return [];
        const result: Results = { top: maxVoteStatement }

        return [result];


    } catch (error) {
        console.error(error);
        return []
    }
}



function getResultsByOptions(statement: Statement, subStatements: Statement[]): Results[] {
    try {
        const { results } = statement;
        const numberOfResults = results?.numberOfResults || 1;


        const maxOptions: Statement[] = subStatements.sort((b, a) => a.consensus - b.consensus)
            .slice(0, numberOfResults || 1);

        const _maxOptions = maxOptions.map((topStatement: Statement) => ({ top: topStatement, sub: [] }))

        return _maxOptions;


    }
    catch (error) {
        console.error(error);
        return []
    }
}

function getTopVoteStatementId(statement: Statement): string | undefined {
    try {
        const { selections } = statement;
        if (!selections) return undefined;

        const maxVoteKey = maxKeyInObject(selections)
        return maxVoteKey;

    } catch (error) {
        console.error(error);
        return undefined;
    }
}