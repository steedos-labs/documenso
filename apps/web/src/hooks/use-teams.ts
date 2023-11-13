import { useState } from 'react';

export const useTeams = () => {
  const [teams, setTeams] = useState([]);

  const [selectedTeam, setSelectedTeam] = useState(null);

  const getTeams = async () => {
    const response = await fetch('/api/teams');
    const data = await response.json();
    setTeams(data);
  };

  const selectTeam = (team) => {
    setSelectedTeam(team);
  };

  return {
    teams,
    getTeams,
    selectedTeam,
    selectTeam,
  };
};
