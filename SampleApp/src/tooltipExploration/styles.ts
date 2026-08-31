import { StyleSheet } from 'react-native';

export const explorationStyles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  description: {
    fontSize: 13,
    color: '#555555',
    marginBottom: 24,
  },
  anchor: {
    alignSelf: 'flex-start',
    backgroundColor: '#088A85',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginBottom: 24,
  },
  anchorText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  button: {
    alignSelf: 'flex-start',
    backgroundColor: '#222222',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginBottom: 12,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  status: {
    fontSize: 12,
    color: '#888888',
    marginTop: 8,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  row: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 6,
    backgroundColor: '#F2F2F2',
    marginBottom: 8,
  },
  rowText: {
    fontSize: 14,
    color: '#222222',
    fontWeight: '600',
  },
  rowSubText: {
    fontSize: 12,
    color: '#888888',
    marginTop: 2,
  },
  segmentRow: {
    flexDirection: 'row',
    marginBottom: 20,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#088A85',
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 6,
    backgroundColor: '#FFFFFF',
  },
  segmentButtonActive: {
    backgroundColor: '#088A85',
  },
  segmentText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#088A85',
    textAlign: 'center',
  },
  segmentTextActive: {
    color: '#FFFFFF',
  },
  case: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  caseTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#222222',
    marginBottom: 4,
  },
  caseDescription: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 12,
  },
  caseExpectation: {
    fontSize: 11,
    color: '#B00020',
    fontStyle: 'italic',
    marginTop: 8,
  },
});
