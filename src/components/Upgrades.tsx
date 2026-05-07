import { decor, skills } from '../data/upgrades';
import { useGame } from '../state/useGame';

export function Upgrades() {
  const { state, dispatch } = useGame();
  return (
    <main className="grid-page">
      <section className="panel">
        <p className="eyebrow">Knowledge economy</p>
        <h2>Skill tree</h2>
        <p className="muted">Knowledge Points: {state.knowledgePoints}</p>
        <div className="upgrade-list">
          {skills.map((skill) => (
            <article className="upgrade-card" key={skill.id}>
              <h3>{skill.name}</h3>
              <p>{skill.description}</p>
              <button type="button" disabled={state.purchasedSkillIds.includes(skill.id) || state.knowledgePoints < skill.cost} onClick={() => dispatch({ type: 'BUY_SKILL', skillId: skill.id, cost: skill.cost })} aria-label={`Learn ${skill.name} for ${skill.cost} Knowledge Points`}>
                {state.purchasedSkillIds.includes(skill.id) ? 'Learned' : `Learn ${skill.cost} KP`}
              </button>
            </article>
          ))}
        </div>
      </section>
      <section className="panel">
        <p className="eyebrow">Office decor</p>
        <h2>Therapeutic setting</h2>
        <div className="upgrade-list">
          {decor.map((item) => (
            <article className="upgrade-card" key={item.id}>
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <button type="button" disabled={state.purchasedDecorIds.includes(item.id) || state.knowledgePoints < item.cost} onClick={() => dispatch({ type: 'BUY_DECOR', decorId: item.id, cost: item.cost })} aria-label={`Buy ${item.name} for ${item.cost} Knowledge Points`}>
                {state.purchasedDecorIds.includes(item.id) ? 'Placed' : `Buy ${item.cost} KP`}
              </button>
            </article>
          ))}
        </div>
        <button type="button" className="secondary" onClick={() => dispatch({ type: 'GO_INBOX' })} aria-label="Return to session request inbox">Return to inbox</button>
      </section>
    </main>
  );
}
