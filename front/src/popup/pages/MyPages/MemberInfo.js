import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/context';
import GaugeBar from '../../components/GaugeBar';

const GroupContributions = () => {
  const { jwt, groupId, members, fetchMembers } = useAuth();
  const [contributions, setContributions] = useState([]);

  useEffect(() => {
    const loadMembers = async () => {
      if (jwt && groupId && groupId !== -1) {
        await fetchMembers(jwt, groupId);
      }
    };
    loadMembers();
  }, [jwt, groupId]);

  useEffect(() => {
    const fetchContributions = async () => {
      if (groupId && groupId !== -1) {
        try {
          const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/groups/contributions/${groupId}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${jwt}`
            }
          });

          if (!response.ok) {
            throw new Error('Failed to fetch contributions');
          }

          const data = await response.json();
          if (data.status === '100 CONTINUE') {
            setContributions(data.data);
          }
        } catch (error) {
          console.error('Error fetching contributions:', error);
        }
      }
    };

    fetchContributions();
  }, [groupId, jwt]);

  const combinedData = members.map(member => {
    const contribution = contributions.find(c => c.nickname === member.name);
    return {
      nickname: member.name,
      individualContribution: contribution ? contribution.individualContribution : 0
    };
  });

  return (
    <div>
      {combinedData.map(member => (
        <div key={member.nickname} style={{ marginBottom: '20px' }}>
          <h4>{member.nickname}</h4>
          <GaugeBar contribution={member.individualContribution} />
        </div>
      ))}
    </div>
  );
};

export default GroupContributions;
