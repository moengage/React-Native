import React, { useState } from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { dismissOverlay, findAndShowToolTipByNativeId } from 'react-native-moengage-tooltip-exploration';
import { explorationStyles as styles } from './styles';

/**
 * Both cases below are RN's <Modal> under a different presentation style — a centered "dialog" and
 * a bottom-anchored "bottom sheet" — because on Android <Modal> is the only built-in RN mechanism
 * that renders content into a separate Window (a Dialog) rather than into the Activity's own
 * decorView. Visual position (centered vs. bottom-anchored) doesn't change that: both hit the exact
 * same cross-window resolution problem documented in "nativeID Failure Cases" → case 2.
 *
 * Two other Android-native "floats above everything" mechanisms exist in RN — Alert.alert() and a
 * native Toast — but neither renders any JS view tree: Alert's buttons/message are native chrome
 * with no nativeID/testID prop to set, and Toast has no view tree at all. So there's nothing to tag
 * or demonstrate resolution against for either; they're mentioned here rather than given their own
 * case.
 */
export default function ModalPresentationsScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text nativeID="modal_presentations_description" testID="modal_presentations_description" style={styles.description}>
        Two more separate-Window presentations, both built on RN's &lt;Modal&gt; — a centered dialog
        box and a bottom-anchored sheet. Same underlying mechanism (and the same cross-window
        nativeID walk fix) as the Modal case on the failure-cases screen, just a different visual
        position. Alert.alert() and a native Toast are the other Android "floats above everything"
        mechanisms, but neither has any JS view tree to tag.
      </Text>

      <DialogCase />
      <BottomSheetCase />
    </ScrollView>
  );
}

function DialogCase() {
  const [visible, setVisible] = useState(false);
  const [status, setStatus] = useState('Idle');

  return (
    <View nativeID="dialog_case" testID="dialog_case" style={styles.case}>
      <Text nativeID="dialog_case_title" testID="dialog_case_title" style={styles.caseTitle}>
        1. Dialog box
      </Text>
      <Text nativeID="dialog_case_description" testID="dialog_case_description" style={styles.caseDescription}>
        A centered card over a dimmed backdrop — the classic "confirm" dialog shape, rendered via
        &lt;Modal transparent animationType="fade"&gt;.
      </Text>
      <TouchableOpacity
        nativeID="dialog_button_open"
        testID="dialog_button_open"
        style={styles.button}
        onPress={() => setVisible(true)}
      >
        <Text style={styles.buttonText}>Open Dialog</Text>
      </TouchableOpacity>
      <Modal visible={visible} transparent animationType="fade">
        <View
          nativeID="dialog_backdrop"
          testID="dialog_backdrop"
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', padding: 24, justifyContent: 'center' }}
        >
          <View nativeID="dialog_card" testID="dialog_card" style={{ backgroundColor: '#FFFFFF', borderRadius: 10, padding: 20 }}>
            <Text nativeID="dialog_card_title" testID="dialog_card_title" style={styles.caseTitle}>
              Confirm action
            </Text>
            <View nativeID="dialog_target" testID="dialog_target" style={styles.anchor}>
              <Text nativeID="dialog_text_target" testID="dialog_text_target" style={styles.anchorText}>
                Anchor inside Dialog
              </Text>
            </View>
            <TouchableOpacity
              nativeID="dialog_button_try_find"
              testID="dialog_button_try_find"
              style={styles.button}
              onPress={() => {
                findAndShowToolTipByNativeId('dialog_text_target', 'Dialog tooltip');
                setStatus('Requested — resolves via the cross-window walk');
              }}
            >
              <Text style={styles.buttonText}>Try Find & Show</Text>
            </TouchableOpacity>
            <TouchableOpacity
              nativeID="dialog_button_close"
              testID="dialog_button_close"
              style={styles.button}
              onPress={() => {
                dismissOverlay();
                setVisible(false);
              }}
            >
              <Text style={styles.buttonText}>Close Dialog</Text>
            </TouchableOpacity>
            <Text nativeID="dialog_status" testID="dialog_status" style={styles.status}>
              Status: {status}
            </Text>
          </View>
        </View>
      </Modal>
      <Text nativeID="dialog_case_expectation" testID="dialog_case_expectation" style={styles.caseExpectation}>
        Expected: resolves — same cross-window walk as the Modal failure case, just styled as a
        centered dialog instead of a full-bleed sheet.
      </Text>
    </View>
  );
}

function BottomSheetCase() {
  const [visible, setVisible] = useState(false);
  const [status, setStatus] = useState('Idle');

  return (
    <View nativeID="bottom_sheet_case" testID="bottom_sheet_case" style={styles.case}>
      <Text nativeID="bottom_sheet_case_title" testID="bottom_sheet_case_title" style={styles.caseTitle}>
        2. Bottom sheet
      </Text>
      <Text nativeID="bottom_sheet_case_description" testID="bottom_sheet_case_description" style={styles.caseDescription}>
        A card pinned to the bottom edge, sliding up over a dimmed backdrop — same &lt;Modal&gt;
        mechanism as the dialog above (transparent, animationType="slide"), just anchored to the
        bottom instead of centered. RN has no separate built-in bottom-sheet component; third-party
        libraries either wrap this exact pattern or render inline (same window, no resolution issue
        at all).
      </Text>
      <TouchableOpacity
        nativeID="bottom_sheet_button_open"
        testID="bottom_sheet_button_open"
        style={styles.button}
        onPress={() => setVisible(true)}
      >
        <Text style={styles.buttonText}>Open Bottom Sheet</Text>
      </TouchableOpacity>
      <Modal visible={visible} transparent animationType="slide">
        <View
          nativeID="bottom_sheet_backdrop"
          testID="bottom_sheet_backdrop"
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}
        >
          <View
            nativeID="bottom_sheet_card"
            testID="bottom_sheet_card"
            style={{
              backgroundColor: '#FFFFFF',
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              padding: 20,
            }}
          >
            <Text nativeID="bottom_sheet_card_title" testID="bottom_sheet_card_title" style={styles.caseTitle}>
              Bottom sheet content
            </Text>
            <View nativeID="bottom_sheet_target" testID="bottom_sheet_target" style={styles.anchor}>
              <Text nativeID="bottom_sheet_text_target" testID="bottom_sheet_text_target" style={styles.anchorText}>
                Anchor inside Bottom Sheet
              </Text>
            </View>
            <TouchableOpacity
              nativeID="bottom_sheet_button_try_find"
              testID="bottom_sheet_button_try_find"
              style={styles.button}
              onPress={() => {
                findAndShowToolTipByNativeId('bottom_sheet_text_target', 'Bottom sheet tooltip');
                setStatus('Requested — resolves via the cross-window walk');
              }}
            >
              <Text style={styles.buttonText}>Try Find & Show</Text>
            </TouchableOpacity>
            <TouchableOpacity
              nativeID="bottom_sheet_button_close"
              testID="bottom_sheet_button_close"
              style={styles.button}
              onPress={() => {
                dismissOverlay();
                setVisible(false);
              }}
            >
              <Text style={styles.buttonText}>Close Bottom Sheet</Text>
            </TouchableOpacity>
            <Text nativeID="bottom_sheet_status" testID="bottom_sheet_status" style={styles.status}>
              Status: {status}
            </Text>
          </View>
        </View>
      </Modal>
      <Text
        nativeID="bottom_sheet_case_expectation"
        testID="bottom_sheet_case_expectation"
        style={styles.caseExpectation}
      >
        Expected: resolves — same cross-window walk as the dialog above.
      </Text>
    </View>
  );
}
