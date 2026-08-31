import React, { useState } from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View, type ViewProps } from 'react-native';
import { dismissOverlay, findAndShowToolTipByNativeId } from 'react-native-moengage-tooltip-exploration';
import { explorationStyles as styles } from './styles';

const HINT = 'If nothing appears below the anchor, check Logcat for MoETooltipNativeTreeWalk.';

export default function NativeIdFailureCasesScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text nativeID="failure_cases_description" testID="failure_cases_description" style={styles.description}>
        Four cases where nativeID is genuinely set in JSX but the native tree walk still can't
        resolve a view for it — each for a different structural reason. A sixth case (a FlatList row
        scrolled past the clipping rect) is demonstrated separately on the "Native Tree Walk in
        FlatList" screen. Case 5 below is a deliberate control, not a failure — it resolves, to show
        where the actual boundary is. Every element on this screen carries both nativeID and testID.
      </Text>

      <NestedTextCase />
      <ModalCase />
      <NonForwardingWrapperCase />
      <DuplicateNativeIdCase />
      <NestedEmptyViewsCase />
    </ScrollView>
  );
}

function NestedTextCase() {
  const [status, setStatus] = useState('Idle');

  return (
    <View nativeID="nested_text_case" testID="nested_text_case" style={styles.case}>
      <Text nativeID="nested_text_case_title" testID="nested_text_case_title" style={styles.caseTitle}>
        1. Nested &lt;Text&gt;
      </Text>
      <Text
        nativeID="nested_text_case_description"
        testID="nested_text_case_description"
        style={styles.caseDescription}
      >
        A &lt;Text nativeID="..."&gt; nested inside another &lt;Text&gt; is a virtual text node — RN
        never creates a real Android View for it, so no view anywhere ever carries the tag.
      </Text>
      <Text nativeID="nested_text_anchor_wrapper" testID="nested_text_anchor_wrapper" style={styles.anchorText}>
        Some intro copy, then{' '}
        <Text nativeID="nested_text_target" testID="nested_text_target" style={{ color: '#088A85', fontWeight: '700' }}>
          the tagged phrase
        </Text>
        .
      </Text>
      <TouchableOpacity
        nativeID="nested_text_button_try_find"
        testID="nested_text_button_try_find"
        style={[styles.button, { marginTop: 12 }]}
        onPress={() => {
          findAndShowToolTipByNativeId('nested_text_target', 'Nested Text tooltip');
          setStatus('Requested — expect no view found');
        }}
      >
        <Text style={styles.buttonText}>Try Find & Show</Text>
      </TouchableOpacity>
      <TouchableOpacity
        nativeID="nested_text_button_dismiss"
        testID="nested_text_button_dismiss"
        style={styles.button}
        onPress={() => dismissOverlay()}
      >
        <Text style={styles.buttonText}>Dismiss</Text>
      </TouchableOpacity>
      <Text nativeID="nested_text_status" testID="nested_text_status" style={styles.status}>
        Status: {status}
      </Text>
      <Text
        nativeID="nested_text_case_expectation"
        testID="nested_text_case_expectation"
        style={styles.caseExpectation}
      >
        Expected: never resolves. {HINT}
      </Text>
    </View>
  );
}

function ModalCase() {
  const [modalVisible, setModalVisible] = useState(false);
  const [status, setStatus] = useState('Idle');

  return (
    <View nativeID="modal_case" testID="modal_case" style={styles.case}>
      <Text nativeID="modal_case_title" testID="modal_case_title" style={styles.caseTitle}>
        2. Inside &lt;Modal&gt;
      </Text>
      <Text nativeID="modal_case_description" testID="modal_case_description" style={styles.caseDescription}>
        RN's &lt;Modal&gt; renders its content into a separate Android Dialog/Window. A walk that
        starts from just the Activity's decorView would never visit it — the tag is real, just
        unreachable from there. This project's nativeID walk now also searches every open window
        (see AppWindows), so this case resolves correctly instead of failing.
      </Text>
      <TouchableOpacity
        nativeID="modal_button_open"
        testID="modal_button_open"
        style={styles.button}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.buttonText}>Open Modal</Text>
      </TouchableOpacity>
      <Modal visible={modalVisible} transparent animationType="fade">
        <View
          nativeID="modal_backdrop"
          testID="modal_backdrop"
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', padding: 20, justifyContent: 'center' }}
        >
          <View nativeID="modal_card" testID="modal_card" style={{ backgroundColor: '#FFFFFF', borderRadius: 8, padding: 20 }}>
            <View nativeID="modal_target" testID="modal_target" style={styles.anchor}>
              <Text nativeID="text_modal_target" testID="text_modal_target" style={styles.anchorText}>
                Anchor inside Modal
              </Text>
            </View>
            <TouchableOpacity
              nativeID="modal_button_try_find"
              testID="modal_button_try_find"
              style={styles.button}
              onPress={() => {
                findAndShowToolTipByNativeId('text_modal_target', 'Modal tooltip');
                setStatus('Requested — resolves via the cross-window walk');
              }}
            >
              <Text style={styles.buttonText}>Try Find & Show</Text>
            </TouchableOpacity>
            <TouchableOpacity
              nativeID="modal_button_close"
              testID="modal_button_close"
              style={styles.button}
              onPress={() => {
                dismissOverlay();
                setModalVisible(false);
              }}
            >
              <Text style={styles.buttonText}>Close Modal</Text>
            </TouchableOpacity>
            <Text nativeID="modal_status" testID="modal_status" style={styles.status}>
              Status: {status}
            </Text>
          </View>
        </View>
      </Modal>
      <Text nativeID="modal_case_expectation" testID="modal_case_expectation" style={styles.caseExpectation}>
        Expected: resolves — the walk now searches every open Android window, not just the
        Activity's. {HINT}
      </Text>
    </View>
  );
}

interface NonForwardingBoxProps extends ViewProps {
  nativeID?: string;
  testID?: string;
}

/** Deliberately drops both nativeID and testID instead of spreading `...rest` onto the inner View. */
function NonForwardingBox({ children, style }: NonForwardingBoxProps) {
  return (
    <View style={style}>
      {children}
    </View>
  );
}

function NonForwardingWrapperCase() {
  const [status, setStatus] = useState('Idle');

  return (
    <View nativeID="wrapper_case" testID="wrapper_case" style={styles.case}>
      <Text nativeID="wrapper_case_title" testID="wrapper_case_title" style={styles.caseTitle}>
        3. Non-forwarding wrapper component
      </Text>
      <Text nativeID="wrapper_case_description" testID="wrapper_case_description" style={styles.caseDescription}>
        nativeID and testID are passed to NonForwardingBox below, but that component never spreads
        either prop onto its underlying View — both are dropped in JS before they ever reach native.
      </Text>
      <NonForwardingBox nativeID="wrapper_target" testID="wrapper_target" style={styles.anchor}>
        <Text nativeID="wrapper_text_target" testID="wrapper_text_target" style={styles.anchorText}>
          Anchor via NonForwardingBox
        </Text>
      </NonForwardingBox>
      <TouchableOpacity
        nativeID="wrapper_button_try_find"
        testID="wrapper_button_try_find"
        style={[styles.button, { marginTop: 12 }]}
        onPress={() => {
          findAndShowToolTipByNativeId('wrapper_target', 'Non-forwarding wrapper tooltip');
          setStatus('Requested — expect no view found');
        }}
      >
        <Text style={styles.buttonText}>Try Find & Show</Text>
      </TouchableOpacity>
      <TouchableOpacity
        nativeID="wrapper_button_dismiss"
        testID="wrapper_button_dismiss"
        style={styles.button}
        onPress={() => dismissOverlay()}
      >
        <Text style={styles.buttonText}>Dismiss</Text>
      </TouchableOpacity>
      <Text nativeID="wrapper_status" testID="wrapper_status" style={styles.status}>
        Status: {status}
      </Text>
      <Text nativeID="wrapper_case_expectation" testID="wrapper_case_expectation" style={styles.caseExpectation}>
        Expected: never resolves — no view is ever tagged. {HINT}
      </Text>
    </View>
  );
}

function DuplicateNativeIdCase() {
  const [status, setStatus] = useState('Idle');

  return (
    <View nativeID="duplicate_case" testID="duplicate_case" style={styles.case}>
      <Text nativeID="duplicate_case_title" testID="duplicate_case_title" style={styles.caseTitle}>
        4. Duplicate nativeID
      </Text>
      <Text nativeID="duplicate_case_description" testID="duplicate_case_description" style={styles.caseDescription}>
        Both boxes below share nativeID="dup_target" (and testID="dup_target"). The walk is a
        pre-order DFS and returns the first match — watch which box the tooltip anchors to.
      </Text>
      <View nativeID="dup_target" testID="dup_target" style={[styles.anchor, { backgroundColor: '#088A85' }]}>
        <Text style={styles.anchorText}>First (declared first)</Text>
      </View>
      <View nativeID="dup_target" testID="dup_target" style={[styles.anchor, { backgroundColor: '#B00020' }]}>
        <Text style={styles.anchorText}>Second (declared second)</Text>
      </View>
      <TouchableOpacity
        nativeID="duplicate_button_try_find"
        testID="duplicate_button_try_find"
        style={styles.button}
        onPress={() => {
          findAndShowToolTipByNativeId('dup_target', 'Duplicate nativeID tooltip');
          setStatus('Requested — should anchor to "First", never "Second"');
        }}
      >
        <Text style={styles.buttonText}>Try Find & Show</Text>
      </TouchableOpacity>
      <TouchableOpacity
        nativeID="duplicate_button_dismiss"
        testID="duplicate_button_dismiss"
        style={styles.button}
        onPress={() => dismissOverlay()}
      >
        <Text style={styles.buttonText}>Dismiss</Text>
      </TouchableOpacity>
      <Text nativeID="duplicate_status" testID="duplicate_status" style={styles.status}>
        Status: {status}
      </Text>
      <Text nativeID="duplicate_case_expectation" testID="duplicate_case_expectation" style={styles.caseExpectation}>
        Expected: always resolves to "First" — ambiguous by design, not a failure to find.
      </Text>
    </View>
  );
}

function NestedEmptyViewsCase() {
  const [status, setStatus] = useState('Idle');

  return (
    <View nativeID="empty_wrapper_case" testID="empty_wrapper_case" style={styles.case}>
      <Text nativeID="empty_wrapper_case_title" testID="empty_wrapper_case_title" style={styles.caseTitle}>
        5. Nested empty wrapper Views — control (resolves)
      </Text>
      <Text
        nativeID="empty_wrapper_case_description"
        testID="empty_wrapper_case_description"
        style={styles.caseDescription}
      >
        Unlike the four cases above, this one is expected to succeed: nativeID/testID are set only
        on the OUTERMOST of two plain, unstyled "passthrough" Views wrapping a Text two levels down
        (View &gt; View &gt; Text — the inner View and the Text carry no tag at all). nativeID forces
        Fabric to keep that outer View as a real, un-flattened node, and the walk is a pre-order DFS
        that checks each node's own tag before descending into its children — so it matches the
        outer View immediately, regardless of what's nested inside it. One catch: neither wrapper
        sets alignSelf, so the outer View stretches to the full content width (RN's cross-axis
        default is stretch) even though nothing about it looks like a box — the tooltip anchors to
        that full-width bounds, not just the visible text.
      </Text>
      <View nativeID="empty_wrapper_target" testID="empty_wrapper_target">
        <View>
          <Text style={{ color: '#222222', fontWeight: '600' }}>
            Text two levels inside two untagged empty Views
          </Text>
        </View>
      </View>
      <TouchableOpacity
        nativeID="empty_wrapper_button_try_find"
        testID="empty_wrapper_button_try_find"
        style={[styles.button, { marginTop: 12 }]}
        onPress={() => {
          findAndShowToolTipByNativeId('empty_wrapper_target', 'Nested empty wrapper tooltip');
          setStatus('Requested — resolves to the outer empty View (likely full-width)');
        }}
      >
        <Text style={styles.buttonText}>Try Find & Show</Text>
      </TouchableOpacity>
      <TouchableOpacity
        nativeID="empty_wrapper_button_dismiss"
        testID="empty_wrapper_button_dismiss"
        style={styles.button}
        onPress={() => dismissOverlay()}
      >
        <Text style={styles.buttonText}>Dismiss</Text>
      </TouchableOpacity>
      <Text nativeID="empty_wrapper_status" testID="empty_wrapper_status" style={styles.status}>
        Status: {status}
      </Text>
      <Text
        nativeID="empty_wrapper_case_expectation"
        testID="empty_wrapper_case_expectation"
        style={styles.caseExpectation}
      >
        Expected: resolves — nesting depth and untagged intermediate Views don't matter to a
        pre-order DFS; only whether the tagged node itself survives Fabric's view-flattening.
      </Text>
    </View>
  );
}
