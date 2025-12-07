import React from 'react';
import { render } from '@testing-library/react-native';
import MoodChip from '../src/components/MoodChip';

describe('Accessibility', () => {
  it('MoodChip has proper accessibility role', () => {
    const { getByRole } = render(
      <MoodChip label="CHILL" color="#5BC0EB" active={false} onPress={() => {}} />
    );

    expect(getByRole('button')).toBeTruthy();
  });

  it('MoodChip announces selected state', () => {
    const { getByRole } = render(
      <MoodChip label="CHILL" color="#5BC0EB" active={true} onPress={() => {}} />
    );

    const button = getByRole('button');
    expect(button.props.accessibilityState).toEqual({ selected: true });
  });

  it('MoodChip has sufficient touch target size', () => {
    const { getByRole } = render(
      <MoodChip label="CHILL" color="#5BC0EB" active={false} onPress={() => {}} />
    );

    const button = getByRole('button');
    const style = button.props.style;

    // Check that minHeight is set (should be at least 44)
    const hasMinHeight = Array.isArray(style)
      ? style.some((s: any) => s?.minHeight >= 44)
      : style?.minHeight >= 44;

    expect(hasMinHeight).toBe(true);
  });
});
