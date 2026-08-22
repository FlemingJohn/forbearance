import { Tag } from "@/components/Tag/Tag";
import { Window } from "@/components/Window/Window";
import "./AssumptionPanel.css";

const casualties = ["Celsius", "BlockFi", "Voyager"];

export function AssumptionPanel() {
  return (
    <Window fileName="the.assumption">
      <p className="assumption-quote">
        “When a position goes bad, a liquidator will show up.”
      </p>

      <p className="text-lede">
        Every lending market on every chain rests on that premise, and nobody
        verifies it.
      </p>

      <p className="text-small">
        When it fails, the position rots past the point where closing it is
        profitable. No liquidator wants it any more, and the protocol absorbs the
        loss as bad debt.
      </p>

      <div className="assumption-casualties">
        {casualties.map((name) => (
          <Tag key={name}>{name}</Tag>
        ))}
      </div>

      <p className="text-small">
        In each case the mechanism did not break. The people it depended on
        stopped showing up, and nobody could see it happening.
      </p>
    </Window>
  );
}
