import React, { useCallback, useMemo, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { PeopleList } from './components/PeopleList';
import { Person } from './types/Person';
import debounce from 'lodash.debounce';

export const App: React.FC = () => {
  const [name, setName] = useState(peopleFromServer[0].name);
  const [born, setBorn] = useState(peopleFromServer[0].born);
  const [died, setDied] = useState(peopleFromServer[0].died);
  const [isFocused, setIsFocused] = useState(false);
  const [query, setQuery] = useState('');
  const [applQuery, setApplQuery] = useState('');
  const [hasMatch, setHasMatch] = useState(true);
  const [isMatch, setIsMatch] = useState(false);

  const applyQuery = useCallback(debounce(setApplQuery, 1000), []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setIsMatch(false);
    applyQuery(event.target.value.toLowerCase());
  };

  const filtredPeople = useMemo(() => {
    const filtredList = peopleFromServer.filter(p =>
      p.name.toLowerCase().includes(applQuery),
    );

    if (filtredList.length === 0) {
      setHasMatch(false);
    } else {
      setHasMatch(true);
    }

    return filtredList;
  }, [applQuery]);

  const choosPerson = (p: Person) => {
    setName(p.name);
    setBorn(p.born);
    setDied(p.died);
    setIsMatch(true);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {isMatch ? `${name} (${born} - ${died})` : 'No selected person'}
        </h1>

        <div className={`dropdown ${isFocused ? 'is-active' : ''}`}>
          <div className="dropdown-trigger">
            <input
              type="text"
              value={query}
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onChange={handleInputChange}
            />
          </div>

          <PeopleList people={filtredPeople} onAdd={choosPerson} />
        </div>

        {!hasMatch ? (
          <div
            className="
              notification
              is-danger
              is-light
              mt-3
              is-align-self-flex-start
            "
            role="alert"
            data-cy="no-suggestions-message"
          >
            <p className="has-text-danger">No matching suggestions</p>
          </div>
        ) : (
          ''
        )}
      </main>
    </div>
  );
};
