import React, { useState } from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View, type ViewProps } from 'react-native';
import { dismissOverlay, findAndShowByNativeId } from 'react-native-moengage-tooltip-exploration';
import { explorationStyles as styles } from './styles';

const HINT = 'If nothing appears below the anchor, check Logcat for MoETooltipNativeTreeWalk.';

export default function NativeIdFailureCasesScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.description}>
        Four cases where nativeID is genuinely set in JSX but the native tree walk still can't
        resolve a view for it — each for a different structural reason. A fifth case (a FlatList row
        scrolled past the clipping rect) is demonstrated separately on the "Native Tree Walk in
        FlatList" screen.
      </Text>

      <NestedTextCase />
      <ModalCase />
      <NonForwardingWrapperCase />
      <DuplicateNativeIdCase />
    </ScrollView>
  );
}

function NestedTextCase() {
  const [status, setStatus] = useState('Idle');

  return (
    <View style={styles.case}>
      <Text style={styles.caseTitle}>1. Nested &lt;Text&gt;</Text>
      <Text style={styles.caseDescription}>
        A &lt;Text nativeID="..."&gt; nested inside another &lt;Text&gt; is a virtual text node — RN
        never creates a real Android View for it, so no view anywhere ever carries the tag.
      </Text>
      <Text style={styles.anchorText}>
        Some intro copy, then{' '}
        <Text nativeID="nested_text_target" style={{ color: '#088A85', fontWeight: '700' }}>
          the tagged phrase
        </Text>
        .
      </Text>
      <TouchableOpacity
        style={[styles.button, { marginTop: 12 }]}
        onPress={() => {
          findAndShowByNativeId('nested_text_target', 'Nested Text tooltip');
          setStatus('Requested — expect no view found');
        }}
      >
        <Text style={styles.buttonText}>Try Find & Show</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => dismissOverlay()}>
        <Text style={styles.buttonText}>Dismiss</Text>
      </TouchableOpacity>
      <Text style={styles.status}>Status: {status}</Text>
      <Text style={styles.caseExpectation}>Expected: never resolves. {HINT}</Text>
    </View>
  );
}

function ModalCase() {
  const [modalVisible, setModalVisible] = useState(false);
  const [status, setStatus] = useState('Idle');

  return (
    <View style={styles.case}>
      <Text style={styles.caseTitle}>2. Inside &lt;Modal&gt;</Text>
      <Text style={styles.caseDescription}>
        RN's &lt;Modal&gt; renders its content into a separate Android Dialog/Window. A walk that
        starts from the Activity's decorView never visits it — the tag is real, just unreachable.
      </Text>
      <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
        <Text style={styles.buttonText}>Open Modal</Text>
      </TouchableOpacity>
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', padding: 20, justifyContent: 'center' }}>
          <View style={{ backgroundColor: '#FFFFFF', borderRadius: 8, padding: 20 }}>
            <View nativeID="modal_target" style={styles.anchor}>
              <Text style={styles.anchorText}>Anchor inside Modal</Text>
            </View>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                findAndShowByNativeId('modal_target', 'Modal tooltip');
                setStatus('Requested — expect no view found (different window)');
              }}
            >
              <Text style={styles.buttonText}>Try Find & Show</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                dismissOverlay();
                setModalVisible(false);
              }}
            >
              <Text style={styles.buttonText}>Close Modal</Text>
            </TouchableOpacity>
            <Text style={styles.status}>Status: {status}</Text>
          </View>
        </View>
      </Modal>
      <Text style={styles.caseExpectation}>Expected: never resolves while inside the Modal. {HINT}</Text>
    </View>
  );
}

interface NonForwardingBoxProps extends ViewProps {
  nativeID?: string;
}

/** Deliberately drops `nativeID` instead of spreading `...rest` onto the inner View. */
function NonForwardingBox({ children, style }: NonForwardingBoxProps) {
  return <View style={style}>{children}</View>;
}

function NonForwardingWrapperCase() {
  const [status, setStatus] = useState('Idle');

  return (
    <View style={styles.case}>
      <Text style={styles.caseTitle}>3. Non-forwarding wrapper component</Text>
      <Text style={styles.caseDescription}>
        nativeID is passed to NonForwardingBox below, but that component never spreads it onto its
        underlying View — the prop is dropped in JS before it ever reaches native.
      </Text>
      <NonForwardingBox nativeID="wrapper_target" style={styles.anchor}>
        <Text style={styles.anchorText}>Anchor via NonForwardingBox</Text>
      </NonForwardingBox>
      <TouchableOpacity
        style={[styles.button, { marginTop: 12 }]}
        onPress={() => {
          findAndShowByNativeId('wrapper_target', 'Non-forwarding wrapper tooltip');
          setStatus('Requested — expect no view found');
        }}
      >
        <Text style={styles.buttonText}>Try Find & Show</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => dismissOverlay()}>
        <Text style={styles.buttonText}>Dismiss</Text>
      </TouchableOpacity>
      <Text style={styles.status}>Status: {status}</Text>
      <Text style={styles.caseExpectation}>Expected: never resolves — no view is ever tagged. {HINT}</Text>
    </View>
  );
}

function DuplicateNativeIdCase() {
  const [status, setStatus] = useState('Idle');

  return (
    <View style={styles.case}>
      <Text style={styles.caseTitle}>4. Duplicate nativeID</Text>
      <Text style={styles.caseDescription}>
        Both boxes below share nativeID="dup_target". The walk is a pre-order DFS and returns the
        first match — watch which box the tooltip anchors to.
      </Text>
      <View nativeID="dup_target" style={[styles.anchor, { backgroundColor: '#088A85' }]}>
        <Text style={styles.anchorText}>First (declared first)</Text>
      </View>
      <View nativeID="dup_target" style={[styles.anchor, { backgroundColor: '#B00020' }]}>
        <Text style={styles.anchorText}>Second (declared second)</Text>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          findAndShowByNativeId('dup_target', 'Duplicate nativeID tooltip');
          setStatus('Requested — should anchor to "First", never "Second"');
        }}
      >
        <Text style={styles.buttonText}>Try Find & Show</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => dismissOverlay()}>
        <Text style={styles.buttonText}>Dismiss</Text>
      </TouchableOpacity>
      <Text style={styles.status}>Status: {status}</Text>
      <Text style={styles.caseExpectation}>
        Expected: always resolves to "First" — ambiguous by design, not a failure to find.
      </Text>
    </View>
  );
}
