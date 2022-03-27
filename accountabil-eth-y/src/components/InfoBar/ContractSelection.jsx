import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRetweet, faFileDownload } from "@fortawesome/free-solid-svg-icons";

const ContractSelection = ({
  selectedContract,
  avaliableContracts,
  getContracts,
  selectContract,
  userAddress,
}) => (
  <div className="user-contractAddresses">
    <label>
      Choose a contract (oldest to newest created)
      <select
        name="contractAddresses"
        id="contractAddresses"
        value={selectedContract || ""}
        disabled={!avaliableContracts.length}
        onChange={(event) => selectContract(event.target.value)}
      >
        <option value="" defaultValue hidden>
          {avaliableContracts.length
            ? "Please choose a contract"
            : "Retrive your contractAddresses to begin"}
        </option>
        ) (
        {avaliableContracts.map((contract, index) => (
          <option key={contract} value={contract}>
            [{index + 1}] {contract}
          </option>
        ))}
        )
      </select>
      <button onClick={getContracts} disabled={!userAddress}>
        {avaliableContracts.length ? (
          <FontAwesomeIcon icon={faRetweet} size="lg" />
        ) : (
          <FontAwesomeIcon icon={faFileDownload} size="lg" />
        )}
      </button>
    </label>
  </div>
);

export default ContractSelection;
