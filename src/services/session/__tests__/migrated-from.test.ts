import { analytics } from '@utils/analytics';
import { SessionStore } from '../session-store';
import { buildSession } from '../wizard-session';

vi.mock('@utils/analytics.js', () => ({
  analytics: { setTag: vi.fn() },
  sessionProperties: vi.fn(() => ({})),
}));

function runSkill(skillId: string) {
  new SessionStore(buildSession({})).setSkillId(skillId);
}

describe('migrated_from', () => {
  beforeEach(() => vi.mocked(analytics.setTag).mockClear());

  it('tags a run of an email migration skill with the provider it moves from', () => {
    runSkill('migrate-email-resend');

    expect(analytics.setTag).toHaveBeenCalledWith('migrated_from', 'resend');
  });

  it('leaves a run of any other skill without the tag', () => {
    runSkill('migrate-statsig');

    expect(analytics.setTag).not.toHaveBeenCalledWith(
      'migrated_from',
      expect.anything(),
    );
  });
});
